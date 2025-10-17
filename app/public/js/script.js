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


// Código para o carrossel automático da home
document.addEventListener('DOMContentLoaded', function() {
  const carouselTrack = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayInterval;

  // Função para ir para um slide específico
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    
    // Atualiza os indicadores
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentIndex);
    });
  }

  // Inicia o autoplay
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000); // Muda de slide a cada 5 segundos
  }

  // Para o autoplay
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  // Adiciona eventos de clique aos indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToSlide(index);
      stopAutoPlay();
      startAutoPlay(); // Reinicia o autoplay
    });
  });

  // Adiciona eventos de mouse para pausar o autoplay quando o mouse está sobre o carrossel
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', stopAutoPlay);
  carouselContainer.addEventListener('mouseleave', startAutoPlay);

  // Inicializa o carrossel
  startAutoPlay();
});

// Código para o carrossel de avaliações (mesmo sistema das vagas)
document.addEventListener('DOMContentLoaded', function() {
  const avaliacoesTrack = document.querySelector('.avaliacoes-carousel-track');
  const avaliacoesSlides = document.querySelectorAll('.avaliacoes-carousel-slide');
  const avaliacoesIndicators = document.querySelectorAll('.avaliacoes-indicator');
  
  if (!avaliacoesTrack || avaliacoesSlides.length === 0) return;
  
  const totalAvaliacoes = avaliacoesSlides.length;
  let currentAvaliacaoIndex = 0;
  let avaliacaoAutoPlayInterval;

  // Função para ir para um slide específico
  function goToAvaliacao(index) {
    if (index < 0) index = totalAvaliacoes - 1;
    if (index >= totalAvaliacoes) index = 0;
    
    avaliacoesTrack.style.transform = `translateX(-${index * 100}%)`;
    currentAvaliacaoIndex = index;
    
    // Atualiza os indicadores
    avaliacoesIndicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentAvaliacaoIndex);
    });
  }

  // Inicia o autoplay
  function startAvaliacaoAutoPlay() {
    avaliacaoAutoPlayInterval = setInterval(() => {
      goToAvaliacao(currentAvaliacaoIndex + 1);
    }, 7000); // Muda de slide a cada 7 segundos
  }

  // Para o autoplay
  function stopAvaliacaoAutoPlay() {
    clearInterval(avaliacaoAutoPlayInterval);
  }

  // Adiciona eventos de clique aos indicadores
  avaliacoesIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToAvaliacao(index);
      stopAvaliacaoAutoPlay();
      startAvaliacaoAutoPlay(); // Reinicia o autoplay
    });
  });

  // Adiciona eventos de mouse para pausar o autoplay
  const avaliacoesContainer = document.querySelector('.avaliacoes-carousel-container');
  if (avaliacoesContainer) {
    avaliacoesContainer.addEventListener('mouseenter', stopAvaliacaoAutoPlay);
    avaliacoesContainer.addEventListener('mouseleave', startAvaliacaoAutoPlay);
  }

  // Inicializa o carrossel
  startAvaliacaoAutoPlay();
});
