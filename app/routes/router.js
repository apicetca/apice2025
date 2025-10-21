var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
const multer = require('multer');
const fs = require('fs');


const uploadDir = '/uploads/';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
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
        fileSize: 5 * 1024 * 1024 
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
    
    const activeTab = req.query.tab || 'jovem';
    
    res.render('pages/login', {
        listaErros: [],
        email: null,
        password: null,
        credencial: null,
        chave: null,
        activeTab
    });    
});

router.post('/login/verify', [
    
    body('email')
        .notEmpty().withMessage('O campo de email é obrigatório')
        .isEmail().withMessage('Por favor, insira um email válido')
        .normalizeEmail(),
    
    
    body('password')
        .notEmpty().withMessage('O campo de senha é obrigatório')
        .isLength({min: 8}).withMessage('A senha deve ter no mínimo 8 caracteres')
        .matches(/\d/).withMessage('A senha deve conter pelo menos um número')
        .matches(/[a-zA-Z]/).withMessage('A senha deve conter pelo menos uma letra')
],
    (req, res) => {
        const listaErros = validationResult(req);
        if (!listaErros.isEmpty()) {
            console.log(listaErros);
            return res.render("pages/login",
                {
                listaErros: listaErros.array(),
                email: req.body.email,
                password: req.body.password,
                credencial: null,
                chave: null,
                activeTab: 'jovem'
                }
            )
        }
        
        const { email, password } = req.body;

        
        
        res.render('pages/login', {
            listaErros: [],
            email,
            password,
            credencial: null,
            chave: null,
            activeTab: 'jovem'
        }); 
});

router.post('/login/empresa', [
    
    body('credencial')
        .notEmpty().withMessage('O campo de credencial é obrigatório')
        .isLength({min: 5}).withMessage('A credencial deve ter no mínimo 5 caracteres')
        .matches(/^[A-Za-z0-9]+$/).withMessage('A credencial deve conter apenas letras e números'),
    
    
    body('chave')
        .notEmpty().withMessage('O campo de chave é obrigatório')
        .isLength({min: 6}).withMessage('A chave deve ter no mínimo 6 caracteres')
        .matches(/\d/).withMessage('A chave deve conter pelo menos um número')
        .matches(/[A-Z]/).withMessage('A chave deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/).withMessage('A chave deve conter pelo menos uma letra minúscula')
],
    (req, res) => {
        const listaErros = validationResult(req);
        if (!listaErros.isEmpty()) {
            console.log(listaErros);
            return res.render("pages/login",
                {
                    listaErros: listaErros.array(),
                    email: null,
                    password: null,
                    credencial: req.body.credencial,
                    chave: req.body.chave,
                    activeTab: 'empresa'
                }
            )
        }
        
        const { credencial, chave } = req.body;

        
        
        res.render('pages/login', {
            listaErros: [],
            email: null,
            password: null,
            credencial,
            chave,
            activeTab: 'empresa'
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
    const user = users.user1; 
    res.render('pages/perfil', { 
        profileImage: null,
        user: user 
})
});


router.post('/upload-profile', upload.single('profileImage'), (req, res) => {
    const user = users.user1; 
    
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

router.get('/config-usuario', function(req, res) {
    res.render('pages/config-usuario');    
});

module.exports = router;

