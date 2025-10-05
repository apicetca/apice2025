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

//função de fechar o menu hambuguer
const closeMobileMenu = document.querySelector('.close-mobile-menu');
if (closeMobileMenu) {
  closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
  });
}

