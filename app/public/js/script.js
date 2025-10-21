

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


const closeMobileMenu = document.querySelector('.close-mobile-menu');
if (closeMobileMenu) {
  closeMobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
  });
}



document.addEventListener('DOMContentLoaded', function() {
  const carouselTrack = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let autoPlayInterval;

  
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    
    
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentIndex);
    });
  }

  
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000); 
  }

  
  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToSlide(index);
      stopAutoPlay();
      startAutoPlay(); 
    });
  });

  
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', stopAutoPlay);
  carouselContainer.addEventListener('mouseleave', startAutoPlay);

  
  startAutoPlay();
});


document.addEventListener('DOMContentLoaded', function() {
  const avaliacoesTrack = document.querySelector('.avaliacoes-carousel-track');
  const avaliacoesSlides = document.querySelectorAll('.avaliacoes-carousel-slide');
  const avaliacoesIndicators = document.querySelectorAll('.avaliacoes-indicator');
  
  if (!avaliacoesTrack || avaliacoesSlides.length === 0) return;
  
  const totalAvaliacoes = avaliacoesSlides.length;
  let currentAvaliacaoIndex = 0;
  let avaliacaoAutoPlayInterval;

  
  function goToAvaliacao(index) {
    if (index < 0) index = totalAvaliacoes - 1;
    if (index >= totalAvaliacoes) index = 0;
    
    avaliacoesTrack.style.transform = `translateX(-${index * 100}%)`;
    currentAvaliacaoIndex = index;
    
    
    avaliacoesIndicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentAvaliacaoIndex);
    });
  }

  
  function startAvaliacaoAutoPlay() {
    avaliacaoAutoPlayInterval = setInterval(() => {
      goToAvaliacao(currentAvaliacaoIndex + 1);
    }, 7000); 
  }

  
  function stopAvaliacaoAutoPlay() {
    clearInterval(avaliacaoAutoPlayInterval);
  }

  
  avaliacoesIndicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      goToAvaliacao(index);
      stopAvaliacaoAutoPlay();
      startAvaliacaoAutoPlay(); 
    });
  });

  
  const avaliacoesContainer = document.querySelector('.avaliacoes-carousel-container');
  if (avaliacoesContainer) {
    avaliacoesContainer.addEventListener('mouseenter', stopAvaliacaoAutoPlay);
    avaliacoesContainer.addEventListener('mouseleave', startAvaliacaoAutoPlay);
  }

  
  startAvaliacaoAutoPlay();
});


