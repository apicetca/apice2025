var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
const multer = require('multer');
const fs = require('fs');

// cria a pasta de uploads caso nao exista
const uploadDir = '/uploads/';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

//configuração de destino de armazenamento e nome do arquivo
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

//configuração do multer
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
        fileSize: 5 * 1024 * 1024 // limita a 5MB
    }
});


router.get('/', function(req, res) {
    res.render('pages/home');    
});

router.get('/empresa', function(req, res) {
    res.render('pages/empresa');    
});

const vagas = require('../data/vagas');

router.get('/vagas/:id', function(req, res) {
    const vagaId = req.params.id;
    console.log('Acessando vaga:', vagaId);
    console.log('Vagas disponíveis:', Object.keys(vagas));
    const vaga = vagas[vagaId];
    console.log('Vaga encontrada:', vaga ? 'Sim' : 'Não');
    
    if (!vaga) {
        console.log('Vaga não encontrada, redirecionando...');
        return res.redirect('/vagas');
    }
    
    res.render('pages/vaga-detalhes', { vaga });
});

router.get('/vagas', function(req, res) {
    res.render('pages/vagas', { vagas });    
});

router.get('/login', (req, res) => {
    res.render('pages/login', {
        listaErros: null,
        email: null,
        password: null
    });    
});

router.post('/login/verify',
    body('email').isEmail().withMessage('O email não é válido').normalizeEmail(),
    body('password').isLength({min: 8}).withMessage('senha inválida'),

    (req, res) => {
         const listaErros = validationResult(req);
    if (!listaErros.isEmpty()) {
        console.log(listaErros);
        return res.render("pages/login",
            {
            listaErros: listaErros.array(),
            email: req.body.email,
            password: req.body.password
            }
        )
    }
        
    const { email, password } = req.body;

        res.render('pages/login',{
            listaErros,
            email,
            password
        }); 
});

router.get('/cadastro', function(req, res) {
    res.render('pages/cadastro');    
});

router.get('/cad2', function(req, res) {
    res.render('pages/cad2');    
});

const users = require('../data/users');

router.get('/perfil', (req, res) => {
    const user = users.user1; // (lembrar de usar ID dinâmico posteriormente)
    res.render('pages/perfil', { 
        profileImage: null,
        user: user 
})
});

// Rota para processar o upload
router.post('/upload-profile', upload.single('profileImage'), (req, res) => {
    const user = users.user1; // Mantém os dados do usuário
    
    if (!req.file) {
        return res.render('pages/perfil', {
            profileImage: null,
            user: user,
            error: 'Nenhum arquivo foi enviado.'
        });
    }

    try {
        const imageUrl = `/uploads/${req.file.filename}`;
        res.render('pages/perfil', { 
            profileImage: imageUrl,
            user: user,
            error: null
        });
    } catch (error) {
        res.render('pages/perfil', {
            profileImage: null,
            user: user,
            error: 'Erro ao processar o upload da imagem.'
        });
    }
});

router.get('/teste', function(req, res) {
    res.render('pages/testemenu');    
});

module.exports = router;