// função do menu hamburguer funcional

const menuHamburguer = document.getElementById('menuHamburguer');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');

menuHamburguer.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  menuOverlay.classList.toggle('open');
});

menuOverlay.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
});


// função do botão vagas/cursos (ver como fazer para alternar a página)
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.toggle-button');
    const buttonGroup = document.querySelector('.button-group');

    if (buttonGroup) {
        buttonGroup.addEventListener('click', (event) => {
            const clickedButton = event.target;

            if (clickedButton.classList.contains('toggle-button')) {
                buttons.forEach(button => {
                    button.classList.remove('active');
                    button.setAttribute('aria-pressed', 'false');
                });
                clickedButton.classList.add('active');
                clickedButton.setAttribute('aria-pressed', 'true');
                const target = clickedButton.dataset.target;
                console.log(`Botão '${target}' foi selecionado.`);
            }
        });
    }
});