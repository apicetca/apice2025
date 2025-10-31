var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const { validationSets, handleValidationErrors, renderWithErrors } = require('../validations/validations');
const { cidadesPorEstado } = require('../data/cidadeProcessor');

// cria a pasta de uploads caso nao exista
const uploadDir = '/uploads/';

// configuração de destino de armazenamento e nome do arquivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// configuração do multer
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Apenas imagens são permitidas!'), false);
        }
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // limita a 5MB
    },
});


router.get('/', function (req, res) {
    res.render('pages/home');
});


router.get('/empresa', function (req, res) {
    res.render('pages/empresa');
});

router.get('/home-jovem', function (req, res) {
    // Enviar algumas vagas visualizadas como exemplo
    const vagasVisualizadas = Object.values(infoVagas).slice(0, 3); // Pega as primeiras 3 vagas
    
    // Garantir que cada vaga tenha o ID correto
    vagasVisualizadas.forEach(vaga => {
        if (!vaga.id && vaga.numero) {
            vaga.id = vaga.numero;
        }
    });
    
    res.render('pages/home-jovem', { vagas: vagasVisualizadas, infoVagas });
});

const vagas = require('../data/vagas');
const infoVagas = require('../data/vagaspt2-completo');
const { encontrarVaga } = require('../data/vagasLoader');

// Sistema simples para armazenar candidaturas (em produção, use banco de dados)
let vagasCandidatadas = [];
let vagasAnteriores = [];

// IMPORTANTE: Esta rota deve vir ANTES de /vagas/:id para evitar conflitos
router.get('/vagas-empresa', function (req, res) {
    console.log('Acessando rota /vagas-empresa');
    try {
        res.render('pages/vagas-empresa');
    } catch (error) {
        console.error('Erro ao renderizar vagas-empresa:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

// API para buscar cidades por estado
router.get('/api/cidades/:estado', function (req, res) {
    const estado = req.params.estado.toUpperCase();
    
    try {
        const cidades = cidadesPorEstado[estado] || [];
        res.json({
            success: true,
            estado: estado,
            cidades: cidades
        });
    } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

// API para listar todos os estados disponíveis
router.get('/api/estados', function (req, res) {
    try {
        const estados = Object.keys(cidadesPorEstado).sort();
        res.json({
            success: true,
            estados: estados
        });
    } catch (error) {
        console.error('Erro ao buscar estados:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

router.get('/vagas/:id', function (req, res) {
    const vagaId = req.params.id;
    console.log('Acessando vaga:', vagaId);
    
    // Verificar em todas as fontes de dados
    let vaga = vagas[vagaId] || infoVagas[vagaId];
    
    console.log('Vaga encontrada:', vaga ? 'Sim' : 'Não');

    if (!vaga) {
        console.log('Vaga não encontrada, redirecionando...');
        return res.redirect('/vagas');
    }

    res.render('pages/vaga-detalhes', { vaga, infoVagas });
});


router.get('/vagas', function (req, res) {
    // Enviando todas as vagas, incluindo ROLTA e RIMBERIO
    const todasVagas = { ...infoVagas };
    
    res.render('pages/vagas', { vagas: todasVagas, infoVagas });
});

// Rota para entrevistas marcadas
router.get('/entrevistas-marcadas', function (req, res) {
    res.render('pages/entrevistas-marcadas');
});

router.get('/vaga-detalhes', function (req, res) {
    const vagaId = req.query.id;
    console.log('Acessando vaga-detalhes:', vagaId);
    
    // Verificar em todas as fontes de dados
    let vaga = vagas[vagaId] || infoVagas[vagaId];
    
    console.log('Vaga encontrada:', vaga ? 'Sim' : 'Não');

    if (!vaga) {
        console.log('Vaga não encontrada, redirecionando...');
        return res.redirect('/vagas');
    }

    res.render('pages/vaga-detalhes', { vaga, infoVagas });
});


router.get('/login', (req, res) => {
    // Determinar qual aba mostrar com base na consulta da URL
    const activeTab = req.query.tab || 'jovem';
    
    res.render('pages/login', {
        listaErros: [],
        email: "",
        password: "",
        activeTab: activeTab,
        query: req.query
    });
});

router.get('/login-usuario', (req, res) => {
    res.render('pages/login-usuario', {
        errors: null,
        form: {},
        query: req.query
    });
});

// Rota para página de login da empresa
router.get('/login-empresa', (req, res) => {
    res.render('pages/login-empresa', {
        errors: null,
        form: {},
        query: req.query
    });
});

// Rota POST para login do usuário
router.post('/login-usuario', [
    body('email')
        .notEmpty()
        .withMessage('E-mail é obrigatório')
        .isEmail()
        .withMessage('Digite um e-mail válido'),
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.render('pages/login-usuario', {
            errors: errors.array(),
            form: req.body,
            query: req.query
        });
    }

    // TODO: Implementar autenticação real (verificar credenciais no banco)
    console.log('Login do usuário validado com sucesso:', req.body.email);
    
    // TODO: Criar sessão do usuário
    // Redirecionar para o portal do usuário
    res.redirect('/home-jovem');
});

// Rota POST para login da empresa
router.post('/login-empresa', [
    body('cnpj')
        .notEmpty()
        .withMessage('CNPJ é obrigatório')
        .custom((value) => {
            // Remover formatação do CNPJ
            const cnpj = value.replace(/\D/g, '');
            if (cnpj.length !== 14) {
                throw new Error('CNPJ deve ter 14 dígitos');
            }
            return true;
        }),
    body('email')
        .notEmpty()
        .withMessage('E-mail é obrigatório')
        .isEmail()
        .withMessage('Digite um e-mail válido'),
    body('password')
        .notEmpty()
        .withMessage('Senha é obrigatória')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres')
], (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.render('pages/login-empresa', {
            errors: errors.array(),
            form: req.body,
            query: req.query
        });
    }

    // TODO: Implementar autenticação real (verificar credenciais no banco)
    console.log('Login da empresa validado com sucesso:', req.body.email);
    
    // TODO: Criar sessão da empresa
    // Redirecionar para o portal da empresa
    res.redirect('/home-empresa');
});


router.post(
    '/login/verify',
    validationSets.loginJovem,
    handleValidationErrors,
    (req, res) => {
        // Verificar se há erros de validação e renderizar com erros
        const errorRender = renderWithErrors(req, res, 'pages/login', {
            activeTab: 'jovem',
            email: req.body.email,
            password: req.body.password
        });
        
        if (errorRender !== null) return errorRender;

        // Se chegou aqui, validação passou - implementar lógica de autenticação
        console.log('Login do jovem validado com sucesso:', req.body.email);
        
        // TODO: Implementar autenticação real (verificar credenciais no banco)
        // TODO: Criar sessão do usuário
        
        // Redirecionar para o portal do jovem
        res.redirect('/home-jovem');
    }
);

// Rota para login de empresa
router.post(
    '/login/empresa',
    validationSets.loginEmpresa,
    handleValidationErrors,
    (req, res) => {
        // Verificar se há erros de validação e renderizar com erros
        const errorRender = renderWithErrors(req, res, 'pages/login', {
            activeTab: 'empresa',
            credencial: req.body.credencial,
            chave: req.body.chave
        });
        
        if (errorRender !== null) return errorRender;

        // Se chegou aqui, validação passou - implementar lógica de autenticação
        console.log('Login da empresa validado com sucesso:', req.body.credencial);
        
        // TODO: Implementar autenticação real (verificar credenciais no banco)
        // TODO: Criar sessão da empresa
        
        // Redirecionar para o portal da empresa
        res.redirect('/empresa');
    }
);


router.get('/cadastro', function (req, res) {
    res.render('pages/cadastro', { errors: null, form: {} });
});

// POST: Validar primeira página do cadastro de jovem
router.post(
    '/cadastro',
    validationSets.cadastroJovem,
    handleValidationErrors,
    (req, res) => {
        // Verificar se há erros de validação e renderizar com erros
        const errorRender = renderWithErrors(req, res, 'pages/cadastro');
        
        if (errorRender !== null) return errorRender;

        // Se validação passou, armazenar dados na sessão e ir para próxima página
        req.session.cadastroJovem = req.body;
        console.log('Primeira página do cadastro validada:', req.body);
        
        res.redirect('/cad2');
    }
);

router.get('/cad2', function (req, res) {
    // Verificar se passou pela primeira página
    if (!req.session.cadastroJovem) {
        return res.redirect('/cadastro');
    }
    
    res.render('pages/cad2', { errors: null, form: {} });
});

router.post(
    '/cad2',
    validationSets.cadastroJovem2,
    handleValidationErrors,
    (req, res) => {
        if (!req.session.cadastroJovem) {
            return res.redirect('/cadastro');
        }
        
        const errorRender = renderWithErrors(req, res, 'pages/cad2');
        
        if (errorRender !== null) return errorRender;

        const dadosCompletos = {
            ...req.session.cadastroJovem,
            ...req.body
        };
        
        console.log('Cadastro completo validado:', dadosCompletos);
        
        delete req.session.cadastroJovem;
        
        res.redirect('/login-usuario?cadastro=sucesso');
    }
);


const users = require('../data/users');


router.get('/perfil', (req, res) => {
    const user = users.user1;
    res.render('pages/perfil', {
        profileImage: '/img/default-profile.png',
        user: user,
    });
});


router.post('/upload-profile', upload.single('profileImage'), (req, res) => {
    const user = users.user1;
    if (!req.file) {
        return res.render('pages/perfil', {
            profileImage: '/img/default-profile.png',
            user: user,
            error: 'Nenhum arquivo foi enviado.',
        });
    }

    try {
        const imageUrl = `/uploads/${req.file.filename}`;
        res.render('pages/perfil', {
            profileImage: imageUrl,
            user: user,
            error: null,
        });
    } catch (error) {
        res.render('pages/perfil', {
            profileImage: null,
            user: user,
            error: 'Erro ao processar o upload da imagem.',
        });
    }
});


router.get('/minhas-vagas', function (req, res) {
    const todasVagas = { ...infoVagas };
    
    res.render('pages/minhasvagas', { 
        vagas: todasVagas, 
        infoVagas,
        vagasCandidatadas,
        vagasAnteriores 
    });
});

router.post('/candidatar', function (req, res) {
    const { vagaId } = req.body;
    
    if (vagaId && infoVagas[vagaId]) {
        if (!vagasCandidatadas.includes(vagaId)) {
            vagasCandidatadas.push(vagaId);
        }
    }
    
    res.redirect(`/vaga-detalhes?id=${vagaId}`);
});

router.post('/cancelar-candidatura', function (req, res) {
    const { vagaId } = req.body;
    
    const index = vagasCandidatadas.indexOf(vagaId);
    if (index > -1) {
        vagasCandidatadas.splice(index, 1);
        if (!vagasAnteriores.includes(vagaId)) {
            vagasAnteriores.push(vagaId);
        }
    }
    
    res.redirect('/minhas-vagas');
});


router.get('/teste2', function (req, res) {
    res.render('pages/cadastro-empresa2', { form: {}, errors: null });
});


router.get('/teste3', function (req, res) {
    res.render('pages/cadastro-empresa3');
});


router.get('/cadastro-empresa', function (req, res) {
    res.render('pages/cadastro-empresa', { form: {}, errors: null });
});


router.post(
    '/cadastro-empresa',
    validationSets.cadastroEmpresa,
    handleValidationErrors,
    (req, res) => {
        const errorRender = renderWithErrors(req, res, 'pages/cadastro-empresa');
        
        if (errorRender !== null) return errorRender;

        req.session.cadastroEmpresa = req.body;
        console.log('Cadastro empresa validado:', req.body);
        
        
        res.redirect('/teste2');
    }
);

router.post(
    '/cadastro-empresa2',
    validationSets.cadastroEmpresaRepresentante,
    handleValidationErrors,
    (req, res) => {
        // Verificar se há erros de validação e renderizar com erros
        const errorRender = renderWithErrors(req, res, 'pages/cadastro-empresa2');
        
        if (errorRender !== null) return errorRender;

        if (!req.session) {
            req.session = {};
        }
        req.session.representanteData = req.body;
        console.log('Dados do representante validados:', req.body);
        
        return res.redirect('/teste3');
    }
);

// Rota POST para finalizar o cadastro da empresa
router.post('/cadastro-empresa3', 
    [
        body('area').notEmpty().withMessage('A área é obrigatória'),
        body('eixo').notEmpty().withMessage('O eixo de atuação é obrigatório')
    ],
    handleValidationErrors,
    (req, res) => {
        // Verificar se há erros de validação
        const errorRender = renderWithErrors(req, res, 'pages/cadastro-empresa3');
        if (errorRender !== null) return errorRender;

        if (!req.session) {
            req.session = {};
        }
        
        // Salvar os dados finais da empresa
        req.session.areaEixoData = req.body;
        
        // Aqui você pode processar todos os dados do cadastro:
        const dadosCompletos = {
            empresa: req.session.cadastroEmpresa,
            representante: req.session.representanteData,
            areaEixo: req.session.areaEixoData
        };
        
        console.log('Cadastro da empresa finalizado:', dadosCompletos);
        
        // Limpar os dados da sessão após processar
        delete req.session.cadastroEmpresa;
        delete req.session.representanteData;
        delete req.session.areaEixoData;
        
        // Redirecionar para a página de login da empresa
        return res.redirect('/login-empresa');
    }
);

router.get('/home-empresa', function (req, res) {
    res.render('pages/home-empresa');
});

router.get('/processos-seletivos-ativos', function (req, res) {
    res.render('pages/processos-seletivos');
});

router.get('/analise-vagas', function (req, res) {
    res.render('pages/analise-vagas');
});

router.get('/sala-reuniao', function (req, res) {
    res.render('pages/saladereunião');
});

router.get('/pagamento', function (req, res) {
    res.render('pages/pagamento');
});

module.exports = router;