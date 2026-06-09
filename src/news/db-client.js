import { createClient } from '@supabase/supabase-js';
import { ADMIN_EMAIL, ADMIN_PASSWORD, DEFAULT_POSTS } from './constants.js';

const POSTS_STORAGE_KEY = 'cci_posts';
const SESSION_STORAGE_KEY = 'cci_admin_session';

const isValidJWT = (token) => token && token.split('.').length === 3;

function initLocalStoragePosts() {
  if (!localStorage.getItem(POSTS_STORAGE_KEY)) {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(DEFAULT_POSTS));
  }
}

function getLocalPosts() {
  initLocalStoragePosts();
  const posts = JSON.parse(localStorage.getItem(POSTS_STORAGE_KEY));
  return posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function saveLocalPosts(posts) {
  localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
}

function createLocalSession(email) {
  const userSession = { email, role: 'authenticated' };
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userSession));
  return { user: userSession };
}

function tryLocalLogin(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return createLocalSession(email);
  }
  throw new Error(
    "E-mail ou senha incorretos. Dica Local: use 'publicidade@portalcci.com.br' com senha 'cci123'."
  );
}

export function createDbClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  let supabase = null;
  let useLocalStorageFallback = false;

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'seu_supabase_url' || !isValidJWT(supabaseKey)) {
    console.warn(
      'Supabase credentials missing or invalid anon key format (must be a JWT). Falling back to LocalStorage mock database.'
    );
    useLocalStorageFallback = true;
  } else {
    try {
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (err) {
      console.error('Failed to initialize Supabase:', err);
      useLocalStorageFallback = true;
    }
  }

  return {
    async getPosts() {
      if (useLocalStorageFallback) return getLocalPosts();

      try {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('Supabase SELECT error, falling back to LocalStorage database:', error);
        return getLocalPosts();
      }
    },

    async createPost(post) {
      if (useLocalStorageFallback) {
        const posts = getLocalPosts();
        const newPost = { id: `mock-${Date.now()}`, ...post, created_at: new Date().toISOString() };
        posts.push(newPost);
        saveLocalPosts(posts);
        return newPost;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data, error } = await supabase
          .from('posts')
          .insert([{ ...post, user_id: user?.id }])
          .select();
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.warn('Supabase INSERT error, writing to LocalStorage instead:', error);
        const posts = getLocalPosts();
        const newPost = { id: `mock-${Date.now()}`, ...post, created_at: new Date().toISOString() };
        posts.push(newPost);
        saveLocalPosts(posts);
        return newPost;
      }
    },

    async updatePost(id, postUpdates) {
      if (useLocalStorageFallback) {
        const posts = getLocalPosts();
        const index = posts.findIndex((p) => p.id === id);
        if (index === -1) throw new Error('Publicação não encontrada');
        posts[index] = { ...posts[index], ...postUpdates };
        saveLocalPosts(posts);
        return posts[index];
      }

      try {
        const { data, error } = await supabase.from('posts').update(postUpdates).eq('id', id).select();
        if (error) throw error;
        return data[0];
      } catch (error) {
        console.warn('Supabase UPDATE error, applying to LocalStorage instead:', error);
        const posts = getLocalPosts();
        const index = posts.findIndex((p) => p.id === id);
        if (index === -1) throw new Error('Publicação não encontrada');
        posts[index] = { ...posts[index], ...postUpdates };
        saveLocalPosts(posts);
        return posts[index];
      }
    },

    async deletePost(id) {
      if (useLocalStorageFallback) {
        saveLocalPosts(getLocalPosts().filter((p) => p.id !== id));
        return true;
      }

      try {
        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (error) {
        console.warn('Supabase DELETE error, removing from LocalStorage instead:', error);
        saveLocalPosts(getLocalPosts().filter((p) => p.id !== id));
        return true;
      }
    },

    async login(email, password) {
      if (useLocalStorageFallback) return tryLocalLogin(email, password);

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
      } catch (error) {
        try {
          return tryLocalLogin(email, password);
        } catch {
          throw error;
        }
      }
    },

    async logout() {
      if (!useLocalStorageFallback) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('Supabase signOut error:', e);
        }
      }
      localStorage.removeItem(SESSION_STORAGE_KEY);
    },

    async getCurrentUser() {
      if (useLocalStorageFallback) {
        const session = localStorage.getItem(SESSION_STORAGE_KEY);
        return session ? JSON.parse(session) : null;
      }

      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const session = localStorage.getItem(SESSION_STORAGE_KEY);
        return user || (session ? JSON.parse(session) : null);
      } catch {
        const session = localStorage.getItem(SESSION_STORAGE_KEY);
        return session ? JSON.parse(session) : null;
      }
    },
  };
}
