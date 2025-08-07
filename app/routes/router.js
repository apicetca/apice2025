var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('pages/home');    
});

router.get('/empresa', function(req, res) {
    res.render('pages/empresa');    
});

router.get('/vagas', function(req, res) {
    res.render('pages/vagas');    
});

router.get('/login', function(req, res) {
    res.render('pages/login');    
});



module.exports = router;