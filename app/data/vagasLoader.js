
const infoVagas = require('./vagaspt2-completo');


function carregarVagasJSON() {
    
    return infoVagas;
}


function encontrarVaga(id) {
    const vagas = carregarVagasJSON();
    return vagas[id] || null;
}


module.exports = {
    carregarVagasJSON,
    encontrarVaga
};

