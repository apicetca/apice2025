// filtrar

document.addEventListener('DOMContentLoaded', () => {
  const btnFiltrar = document.querySelector('.btn-filtrar');
  const filterBox = document.querySelector('.filter-box');
  const closeBtn = document.querySelector('.close-btn');

  if (btnFiltrar && filterBox) {
    btnFiltrar.addEventListener('click', () => {
      filterBox.classList.toggle('visivel');
    });
  }

  if (closeBtn && filterBox) {
    closeBtn.addEventListener('click', () => {
      filterBox.classList.remove('visivel');
    });
  }
});

// Função para limpar todos os filtros
function limparTodosFiltros() {
    // Limpa os radio buttons (Presencial, Híbrido, Remoto)
    const radioButtons = document.querySelectorAll('.filter-options input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.checked = false;
    });

    // Limpa os checkboxes (Jovem Aprendiz, Estágio, Trainee)
    const checkboxes = document.querySelectorAll('.checkbox-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Limpa o campo de texto de locais
    const inputLocal = document.querySelector('.filter-local input[type="text"]');
    if (inputLocal) {
        inputLocal.value = '';
    }
}

// Adiciona o evento de clique ao botão de limpar filtros
document.addEventListener('DOMContentLoaded', function() {
    const botaoLimpar = document.getElementById('limparFiltros');
    if (botaoLimpar) {
        botaoLimpar.addEventListener('click', limparTodosFiltros);
    }
});