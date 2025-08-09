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

router.get('/login',
     (req, res) => {
    res.render('pages/login', {
        email: null,
        password: null
    });    
});
router.post('/login/verify',
    body('email').isEmail().withMessage('O email não é válido').normalizeEmail(),

    body('password').isLength({min: 8}).withMessage('senha inválida')
)


module.exports = router;