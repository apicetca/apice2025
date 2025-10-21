const vagas = {
    rolta: {
        id: 'rolta',
        titulo: 'ROLTA',
        programa: 'Programa Jovem Aprendiz - 2025',
        imagem: '/img/rolta.png',
        dataInicio: '2025-10-09',
        dataFim: '2025-10-16',
        dataInicioFormatada: '09/10',
        dataFimFormatada: '16/10',
        descricao: 'O Programa Jovem Aprendiz da ROLTA oferece uma oportunidade única para jovens talentos iniciarem sua carreira profissional. Durante o programa, você terá a chance de aprender na prática, desenvolvendo habilidades essenciais para o mercado de trabalho.',
        requisitos: [
            'Ter entre 14 e 24 anos',
            'Estar cursando ou ter concluído o ensino médio',
            'Não ter experiência profissional anterior',
            'Disponibilidade para trabalhar 6 horas diárias'
        ],
        beneficios: [
            'Bolsa-auxílio compatível com o mercado',
            'Vale-transporte',
            'Vale-refeição',
            'Seguro de vida',
            'Curso de aprendizagem profissional'
        ],
        local: 'São Paulo - SP'
    },
    rimberio: {
        id: 'rimberio',
        imagembanner: '/img/rimberiobanner.png',
        titulo: 'RIMBERIO',
        programa: 'Programa Estágio - 2025',
        imagem: '/img/rimberio-logo.png',
        dataInicio: '2025-10-30',
        dataFim: '2025-12-01',
        dataInicioFormatada: '30/10',
        dataFimFormatada: '01/12',
        descricao: 'O Programa de Estágio da RIMBERIO é uma excelente porta de entrada para estudantes universitários que buscam crescimento profissional. Aqui você terá a oportunidade de aplicar seus conhecimentos acadêmicos em projetos reais.',
        requisitos: [
            'Estar cursando ensino superior',
            'Previsão de formatura a partir de 12/2026',
            'Conhecimento intermediário de inglês',
            'Disponibilidade para estagiar 6 horas diárias'
        ],
        beneficios: [
            'Bolsa-estágio competitiva',
            'Vale-refeição',
            'Vale-transporte',
            'Seguro de vida',
            'Recesso remunerado',
            'Programa de desenvolvimento estruturado'
        ],
        local: 'Rio de Janeiro - RJ'
    },
};

module.exports = vagas;

