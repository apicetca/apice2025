var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');
const { validationSets, handleValidationErrors, renderWithErrors } = require('../validations/validations');
const { cidadesPorEstado } = require('../data/cidadeProcessor');

const vagas = require('../data/vagas');
const infoVagas = require('../data/vagaspt2-completo');
const { encontrarVaga } = require('../data/vagasLoader');

const uploadDir = '/uploads/';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

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
        fileSize: 5 * 1024 * 1024,
    },
});


router.get('/', function (req, res) {

    const vagasCarrossel = Object.values(infoVagas).slice(0, 3);
    res.render('pages/home', { vagas: vagasCarrossel, infoVagas });
});


router.get('/empresa', function (req, res) {
    res.render('pages/empresa');
});

router.get('/sobre-nos', function (req, res) {
    res.render('pages/sobre-nos');
});

router.get('/fale-conosco', function (req, res) {
    console.log('Rota /fale-conosco acessada');
    try {
        res.render('pages/fale-conosco');
    } catch (error) {
        console.error('Erro ao renderizar fale-conosco:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/config-usuario', function (req, res) {
    console.log('Rota /config-usuario acessada');
    try {
        res.render('pages/config-usuario');
    } catch (error) {
        console.error('Erro ao renderizar config-usuario:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/config-empresa', function (req, res) {
    console.log('Rota /config-empresa acessada');
    try {
        res.render('pages/config-empresa');
    } catch (error) {
        console.error('Erro ao renderizar config-empresa:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/home-jovem', function (req, res) {
    const vagasVisualizadas = Object.values(infoVagas).slice(0, 3); // Pega as primeiras 3 vagas
    
    vagasVisualizadas.forEach(vaga => {
        if (!vaga.id && vaga.numero) {
            vaga.id = vaga.numero;
        }
    });
    
    res.render('pages/home-jovem', { vagas: vagasVisualizadas, infoVagas });
});

router.get('/cadCurriculo1', function (req, res) {
    console.log('Rota /cadCurriculo1 acessada');
    try {
        res.render('pages/cadCurriculo1');
    } catch (error) {
        console.error('Erro ao renderizar cadCurriculo1:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/cadCurriculo2', function (req, res) {
    console.log('Rota /cadCurriculo2 acessada');
    try {
        res.render('pages/cadCurriculo2');
    } catch (error) {
        console.error('Erro ao renderizar cadCurriculo2:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/cadCurriculo3', function (req, res) {
    console.log('Rota /cadCurriculo3 acessada');
    try {
        res.render('pages/cadCurriculo3');
    } catch (error) {
        console.error('Erro ao renderizar cadCurriculo3:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/cad-curriculo', function (req, res) {
    console.log('Rota /cad-curriculo acessada - redirecionando para cadCurriculo1');
    res.redirect('/cadCurriculo1');
});

router.post('/cadCurriculo-submit', function (req, res) {
    try {
        const dadosCompletos = {
            ...req.session.curriculoEtapa1,
            ...req.session.curriculoEtapa2,
            ...req.body
        };
        
        console.log('Cadastro de currículo finalizado:', dadosCompletos);
        
        delete req.session.curriculoEtapa1;
        delete req.session.curriculoEtapa2;
        
        res.redirect('/home-jovem?cadastro=sucesso');
    } catch (error) {
        console.error('Erro ao finalizar cadastro de currículo:', error);
        res.status(500).render('pages/cadCurriculo3', {
            error: 'Erro interno do servidor. Tente novamente.'
        });
    }
});

let vagasCandidatadas = [];
let vagasAnteriores = [];

router.get('/vagas-empresa', function (req, res) {
    console.log('Acessando rota /vagas-empresa');
    try {
        res.render('pages/vagas-empresa');
    } catch (error) {
        console.error('Erro ao renderizar vagas-empresa:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

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
    
    let vaga = vagas[vagaId] || infoVagas[vagaId];
    
    console.log('Vaga encontrada:', vaga ? 'Sim' : 'Não');

    if (!vaga) {
        console.log('Vaga não encontrada, redirecionando...');
        return res.redirect('/vagas');
    }

    res.render('pages/vaga-detalhes', { vaga, infoVagas });
});


router.get('/vagas', function (req, res) {
    const todasVagas = { ...infoVagas };
    
    res.render('pages/vagas', { vagas: todasVagas, infoVagas });
});

router.get('/entrevistas-marcadas', function (req, res) {
    res.render('pages/entrevistas-marcadas');
});

router.get('/vaga-detalhes', function (req, res) {
    const vagaId = req.query.id;
    console.log('Acessando vaga-detalhes:', vagaId);
    
    let vaga = vagas[vagaId] || infoVagas[vagaId];
    
    console.log('Vaga encontrada:', vaga ? 'Sim' : 'Não');

    if (!vaga) {
        console.log('Vaga não encontrada, redirecionando...');
        return res.redirect('/vagas');
    }

    res.render('pages/vaga-detalhes', { vaga, infoVagas });
});


router.get('/login', (req, res) => {
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

router.get('/login-empresa', (req, res) => {
    res.render('pages/login-empresa', {
        errors: null,
        form: {},
        query: req.query
    });
});

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

    console.log('Login do usuário validado com sucesso:', req.body.email);
    
    res.redirect('/home-jovem');
});

router.post('/login-empresa', [
    body('cnpj')
        .notEmpty()
        .withMessage('CNPJ é obrigatório')
        .custom((value) => {
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

    console.log('Login da empresa validado com sucesso:', req.body.email);
    
    res.redirect('/home-empresa');
});


router.post(
    '/login/verify',
    validationSets.loginJovem,
    handleValidationErrors,
    (req, res) => {
        const errorRender = renderWithErrors(req, res, 'pages/login', {
            activeTab: 'jovem',
            email: req.body.email,
            password: req.body.password
        });
        
        if (errorRender !== null) return errorRender;

        console.log('Login do jovem validado com sucesso:', req.body.email);
        res.redirect('/home-jovem');
    }
);

router.post(
    '/login/empresa',
    validationSets.loginEmpresa,
    handleValidationErrors,
    (req, res) => {
        const errorRender = renderWithErrors(req, res, 'pages/login', {
            activeTab: 'empresa',
            credencial: req.body.credencial,
            chave: req.body.chave
        });
        
        if (errorRender !== null) return errorRender;

        console.log('Login da empresa validado com sucesso:', req.body.credencial);
                res.redirect('/empresa');
    }
);


router.get('/cadastro', function (req, res) {
    res.render('pages/cadastro', { errors: null, form: {} });
});

router.post(
    '/cadastro',
    validationSets.cadastroJovem,
    handleValidationErrors,
    (req, res) => {
        const errorRender = renderWithErrors(req, res, 'pages/cadastro');
        
        if (errorRender !== null) return errorRender;

        req.session.cadastroJovem = req.body;
        console.log('Primeira página do cadastro validada:', req.body);
        
        res.redirect('/cad2');
    }
);

router.get('/cad2', function (req, res) {
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


router.get('/cadastro-empresa2', function (req, res) {
    res.render('pages/cadastro-empresa2', { form: {}, errors: null });
});

router.get('/cadastro-empresa3', function (req, res) {
    res.render('pages/cadastro-empresa3');
});

router.get('/teste2', function (req, res) {
    res.redirect('/cadastro-empresa2');
});

router.get('/teste3', function (req, res) {
    res.redirect('/cadastro-empresa3');
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
        
        
        res.redirect('/cadastro-empresa2');
    }
);

router.post(
    '/cadastro-empresa2',
    validationSets.cadastroEmpresaRepresentante,
    handleValidationErrors,
    (req, res) => {
        const errorRender = renderWithErrors(req, res, 'pages/cadastro-empresa2');
        
        if (errorRender !== null) return errorRender;

        if (!req.session) {
            req.session = {};
        }
        req.session.representanteData = req.body;
        console.log('Dados do representante validados:', req.body);
        
        return res.redirect('/cadastro-empresa3');
    }
);

router.post('/cadastro-empresa-submit', function (req, res) {
    try {
        const dadosCompletos = {
            ...req.session.cadastroEmpresa,
            ...req.session.representanteData,
            ...req.body
        };
        
        console.log('Cadastro de empresa finalizado:', dadosCompletos);
        
      delete req.session.cadastroEmpresa;
        delete req.session.representanteData;
        
        res.redirect('/home-empresa?cadastro=sucesso');
    } catch (error) {
        console.error('Erro ao finalizar cadastro:', error);
        res.status(500).render('pages/cadastro-empresa3', {
            error: 'Erro interno do servidor. Tente novamente.'
        });
    }
});

router.get('/home-empresa', function (req, res) {
    res.render('pages/home-empresa');
});

router.get('/analise-vagas', function (req, res) {
    console.log('Rota /analise-vagas acessada');
    try {
        const todasVagas = { ...infoVagas };
        res.render('pages/analise-vagas', { vagas: todasVagas, infoVagas });
    } catch (error) {
        console.error('Erro ao renderizar analise-vagas:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/pagamento', function (req, res) {
    console.log('Rota /pagamento acessada');
    try {
        res.render('pages/pagamento');
    } catch (error) {
        console.error('Erro ao renderizar pagamento:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/processos-seletivos', function (req, res) {
    console.log('Rota /processos-seletivos acessada');
    try {
        res.render('pages/processos-seletivos');
    } catch (error) {
        console.error('Erro ao renderizar processos-seletivos:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/sala-reuniao', function (req, res) {
    console.log('Rota /sala-reuniao acessada');
    try {
        res.render('pages/saladereunião');
    } catch (error) {
        console.error('Erro ao renderizar sala-reuniao:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

router.get('/teste-menu', function (req, res) {
    console.log('Rota /teste-menu acessada');
    try {
        res.render('pages/testemenu');
    } catch (error) {
        console.error('Erro ao renderizar teste-menu:', error);
        res.status(500).send('Erro interno do servidor');
    }
});


module.exports = router;