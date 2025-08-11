const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'app/public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

var rotas = require('./app/routes/router');
app.use('/', rotas);

app.listen(port, () => {
    console.log(`Servidor online em: http://localhost:${port}`);
});
