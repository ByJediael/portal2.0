export const DEFAULT_POSTS = [
  {
    id: 'mock-1',
    title: 'Corrida Matemática: adição com reserva no Infantil',
    category: 'Educação Infantil',
    excerpt:
      'Uma abordagem prática e dinâmica ensinando raciocínio matemático e noções iniciais através de atividades lúdicas de alta cooperação.',
    content:
      '<p>A matemática na Educação Infantil não precisa ser apenas teórica. Com o projeto Corrida Matemática, nossos pequenos do Jardim II aprenderam o conceito de adição com reserva de forma lúdica.</p><p>Utilizando tabuleiros coloridos de tamanho gigante montados no pátio e dados adaptados, as crianças trabalham em grupos cooperativos para resolver os desafios matemáticos e avançar no tabuleiro.</p><p>Segundo a coordenação pedagógica, essa abordagem concreta ajuda na assimilação intuitiva de conceitos matemáticos abstratos, preparando os alunos para as fases futuras do Ensino Fundamental I com muito mais autoconfiança.</p>',
    image_url: '/hero_bg.png',
    read_time: '3 min de leitura',
    created_at: new Date('2026-04-24T13:00:00Z').toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Ciência em ação: criatividade tecnológica que vai longe',
    category: 'Ensino Médio',
    excerpt:
      'Estudantes do Ensino Médio desenvolvem protótipos de automação sustentável utilizando plataformas de robótica e programação.',
    content:
      '<p>A criatividade e a inovação tecnológica andam juntas no Colégio CCI. Nesta semana, os alunos da 2ª série do Ensino Médio apresentaram seus projetos de robótica voltados à sustentabilidade.</p><p>Usando sensores de umidade, placas controladoras e reciclagem, as equipes desenvolveram um sistema automatizado de irrigação para a horta comunitária da escola, otimizando o uso de água.</p><p>O projeto integra disciplinas de Física, Geografia e Programação Maker, demonstrando na prática como a tecnologia pode ser utilizada para solucionar problemas do cotidiano real.</p>',
    image_url: '/methodology.png',
    read_time: '5 min de leitura',
    created_at: new Date('2026-04-18T14:30:00Z').toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Diálogo, orientação socioemocional e cidadania ativa',
    category: 'Cidadania',
    excerpt:
      'Fóruns internos sobre empatia e inteligência emocional auxiliam os alunos na expressão de sentimentos e construção de valores éticos.',
    content:
      "<p>Com base no programa Escola da Inteligência, o Colégio CCI promoveu mais um fórum de debates com foco em habilidades socioemocionais para os anos finais do Ensino Fundamental.</p><p>O encontro teve como tema 'Empatia e Resolução Construtiva de Conflitos', estimulando os alunos a compartilharem suas visões sobre escuta ativa e acolhimento.</p><p>Para a equipe de orientação, debater esses temas sistematicamente ajuda a construir um ecossistema escolar harmonioso, acolhedor e com cidadãos plenamente conscientes de suas responsabilidades éticas.</p>",
    image_url: '/testimonial_family.png',
    read_time: '4 min de leitura',
    created_at: new Date('2026-04-10T09:15:00Z').toISOString(),
  },
];

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'publicidade@portalcci.com.br';
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cci123';
