var express = require('express');
var router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const fs = require('fs');

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


const vagas = require('../data/vagas');
const infoVagas = require('../data/vagaspt2-completo');
const { encontrarVaga } = require('../data/vagasLoader');

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


router.get('/login', (req, res) => {
    res.render('pages/login', {
        listaErros: [],
        email: "",
        password: "",
    });
});


router.post(
    '/login/verify',
    body('email').isEmail().withMessage('O email não é válido').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('senha inválida'),

    (req, res) => {
        const listaErros = validationResult(req);
        if (!listaErros.isEmpty()) {
            console.log(listaErros);
            return res.render('pages/login', {
                listaErros: listaErros.array(),
                email: req.body.email,
                password: req.body.password,
            });
        }

        const { email, password } = req.body;

        // Processar login aqui
        // Se o login for bem-sucedido, redirecione para a página principal ou perfil
        // Como exemplo, vou redirecionar para home
        return res.redirect('/');
        
        // Se houver erro no login (mas não na validação), você pode renderizar:
        // res.render('pages/login', {
        //     listaErros: [{ path: 'email', msg: 'Email ou senha incorretos' }],
        //     email,
        //     password: '',
        // });
    }
);


router.get('/cadastro', function (req, res) {
    res.render('pages/cadastro');
});


router.get('/cad2', function (req, res) {
    res.render('pages/cad2');
});


const users = require('../data/users');


router.get('/perfil', (req, res) => {
    const user = users.user1; // (lembrar de usar ID dinâmico posteriormente)
    res.render('pages/perfil', {
        profileImage: '/img/default-profile.png',
        user: user,
    });
});


// Rota para processar o upload
router.post('/upload-profile', upload.single('profileImage'), (req, res) => {
    const user = users.user1; // Mantém os dados do usuário

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



router.get('/teste2', function (req, res) {
    res.render('pages/cadastro-empresa2', { form: {}, errors: null });
});


router.get('/teste3', function (req, res) {
    res.render('pages/cadastro-empresa3');
});


// rota de empresa, depois colocar em um arquivo separado
router.get('/cadastro-empresa', function (req, res) {
    res.render('pages/cadastro-empresa', { form: {}, errors: null });
});


// POST: validar dados do cadastro da empresa no servidor
router.post(
    '/cadastro-empresa',
    // validações
    body('razao_social').trim().notEmpty().withMessage('Razão social é obrigatória'),
    body('nome_fantasia').trim().notEmpty().withMessage('Nome fantasia é obrigatória'),
    body('cnpj').trim().matches(/^\d{14}$/).withMessage('CNPJ inválido. Informe 14 números sem pontuação'),
    body('telefone').trim().matches(/^\d{10,11}$/).withMessage('Telefone inválido. Informe 10 ou 11 números'),
    body('logradouro').trim().notEmpty().withMessage('Logradouro é obrigatório'),
    body('cidade').trim().notEmpty().withMessage('Cidade é obrigatória'),
    body('estado').trim().notEmpty().withMessage('Estado é obrigatório'),
    body('cep').trim().matches(/^\d{8}$/).withMessage('CEP inválido. Informe 8 números'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // retornar a página com erros e valores preenchidos
            return res.render('pages/cadastro-empresa', {
                errors: errors.array(),
                form: req.body,
            });
        }

        // Se passou na validação, seguir para próximo passo (temporariamente redireciona)
        // Armazenamos os dados da primeira etapa em session para uso posterior
        if (!req.session) {
            req.session = {};
        }
        req.session.empresaData = req.body;
        return res.redirect('/teste2');
    }
);

// POST: validar dados do representante da empresa (segunda etapa)
router.post(
    '/cadastro-empresa2',
    // validações do formulário do representante
    body('nome').trim().notEmpty().withMessage('Nome do representante é obrigatório'),
    body('cargo').trim().notEmpty().withMessage('Cargo é obrigatório'),
    body('email').trim().isEmail().withMessage('Email institucional inválido'),
    body('telefone').trim().matches(/^\d{10,11}$/).withMessage('Telefone comercial inválido. Informe 10 ou 11 números'),

    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // retornar a página com erros e valores preenchidos
            return res.render('pages/cadastro-empresa2', {
                errors: errors.array(),
                form: req.body,
            });
        }

        // Se passou na validação, armazenar dados e seguir para próxima etapa
        if (!req.session) {
            req.session = {};
        }
        req.session.representanteData = req.body;
        return res.redirect('/teste3');
    }
);

module.exports = router;