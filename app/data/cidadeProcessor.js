const fs = require('fs');
const path = require('path');

// Ler e processar os dados dos municípios
function processarMunicipios() {
    try {
        const dataPath = path.join(__dirname, 'municipios_all.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const municipios = JSON.parse(rawData);
        
        // Organizar cidades por estado
        const cidadesPorEstado = {};
        
        municipios.forEach(municipio => {
            const uf = municipio.microrregiao.mesorregiao.UF.sigla;
            const nomeCidade = municipio.nome;
            
            if (!cidadesPorEstado[uf]) {
                cidadesPorEstado[uf] = [];
            }
            
            // Evitar duplicatas e ordenar alfabeticamente
            if (!cidadesPorEstado[uf].includes(nomeCidade)) {
                cidadesPorEstado[uf].push(nomeCidade);
            }
        });
        
        // Ordenar as cidades de cada estado alfabeticamente
        for (const estado in cidadesPorEstado) {
            cidadesPorEstado[estado].sort();
        }
        
        return cidadesPorEstado;
    } catch (error) {
        console.error('Erro ao processar municípios:', error);
        return {};
    }
}

// Exportar a função e os dados processados
const cidadesPorEstado = processarMunicipios();

module.exports = {
    cidadesPorEstado,
    processarMunicipios
};