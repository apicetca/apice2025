var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");

router.get('/', function(req, res) {
    res.render('pages/home');    
});

router.get('/empresa', function(req, res) {
    res.render('pages/empresa');    
});

router.get('/vagas', function(req, res) {
    res.render('pages/vagas');    
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


module.exports = router;