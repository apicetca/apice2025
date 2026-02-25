const infoVagas = require('./vagaspt2-completo');

function carregarVagasJSON() {
    return infoVagas;
}

/**
 * Verifica se um objeto de vaga existe em qualquer uma das fontes de dados
 * @param {string} id - ID da vaga a ser procurada
 * @returns {object|null} - Objeto da vaga encontrada ou null se não existir
 */
function encontrarVaga(id) {
    const vagas = carregarVagasJSON();
    return vagas[id] || null;
}

module.exports = {
    carregarVagasJSON,
    encontrarVaga
};