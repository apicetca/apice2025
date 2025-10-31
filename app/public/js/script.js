document.addEventListener('DOMContentLoaded', function() {
    const menuHamburguer = document.getElementById('menuHamburguer');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMobileMenu = document.querySelector('.close-mobile-menu');

    function openMenu() {
        mobileMenu.classList.add('open');
        menuOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (menuHamburguer) {
        menuHamburguer.addEventListener('click', function(e) {
            e.preventDefault();
            openMenu();
        });
    }

    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', function(e) {
            e.preventDefault();
            closeMenu();
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', function() {
            closeMenu();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Carrossel automático
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (carouselTrack && carouselSlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = carouselSlides.length;
        let autoSlideInterval;
        let isTransitioning = false;
        
        // Função para mover o carrossel
        function moveToSlide(slideIndex) {
            if (isTransitioning) return;
            
            isTransitioning = true;
            currentSlide = slideIndex;
            // Cada slide ocupa 33.33% da largura, então para mostrar o slide correto
            // precisamos mover o track por (slideIndex * 33.33)%
            const translateX = slideIndex * 33.33;
            
            // Aplicar transformação suave
            carouselTrack.style.transform = `translateX(-${translateX}%)`;
            
            // Atualizar indicadores
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });
            
            // Permitir nova transição após animação completar
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
        
        // Função para avançar automaticamente
        function autoSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            moveToSlide(currentSlide);
        }
        
        // Iniciar carrossel automático
        autoSlideInterval = setInterval(autoSlide, 5000); // 5 segundos
        
        // Adicionar eventos aos indicadores
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (isTransitioning || currentSlide === index) return;
                
                currentSlide = index;
                moveToSlide(currentSlide);
                
                // Reiniciar o timer automático
                clearInterval(autoSlideInterval);
                setTimeout(() => {
                    autoSlideInterval = setInterval(autoSlide, 5000);
                }, 5000);
            });
        });
        
        // Pausar carrossel quando o mouse estiver sobre ele
        const carouselContainer = document.querySelector('.carousel-container');
        if (carouselContainer) {
            carouselContainer.addEventListener('mouseenter', () => {
                clearInterval(autoSlideInterval);
            });
            
            carouselContainer.addEventListener('mouseleave', () => {
                clearInterval(autoSlideInterval);
                autoSlideInterval = setInterval(autoSlide, 5000);
            });
        }
    }

    // Carrossel de avaliações
    const avaliacoesCarouselTrack = document.querySelector('.avaliacoes-carousel-track');
    const avaliacoesSlides = document.querySelectorAll('.avaliacoes-carousel-slide');
    const avaliacoesIndicators = document.querySelectorAll('.avaliacoes-indicator');
    
    if (avaliacoesCarouselTrack && avaliacoesSlides.length > 0) {
        let currentAvaliacaoSlide = 0;
        const totalAvaliacaoSlides = avaliacoesSlides.length;
        let avaliacoesAutoSlideInterval;
        let isAvaliacoesTransitioning = false;
        
        // Função para mover o carrossel de avaliações
        function moveToAvaliacaoSlide(slideIndex) {
            if (isAvaliacoesTransitioning) return;
            
            isAvaliacoesTransitioning = true;
            const translateX = slideIndex * 100;
            
            // Aplicar transformação suave
            avaliacoesCarouselTrack.style.transform = `translateX(-${translateX}%)`;
            
            // Atualizar indicadores
            avaliacoesIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });
            
            // Permitir nova transição após animação completar
            setTimeout(() => {
                isAvaliacoesTransitioning = false;
            }, 600);
        }
        
        // Função para avançar automaticamente
        function autoAvaliacaoSlide() {
            currentAvaliacaoSlide = (currentAvaliacaoSlide + 1) % totalAvaliacaoSlides;
            moveToAvaliacaoSlide(currentAvaliacaoSlide);
        }
        
        // Iniciar carrossel automático
        avaliacoesAutoSlideInterval = setInterval(autoAvaliacaoSlide, 6000); // 6 segundos
        
        // Adicionar eventos aos indicadores
        avaliacoesIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (isAvaliacoesTransitioning || currentAvaliacaoSlide === index) return;
                
                currentAvaliacaoSlide = index;
                moveToAvaliacaoSlide(currentAvaliacaoSlide);
                
                // Reiniciar o timer automático
                clearInterval(avaliacoesAutoSlideInterval);
                setTimeout(() => {
                    avaliacoesAutoSlideInterval = setInterval(autoAvaliacaoSlide, 6000);
                }, 6000);
            });
        });
        
        // Pausar carrossel quando o mouse estiver sobre ele
        const avaliacoesCarouselContainer = document.querySelector('.avaliacoes-carousel-container');
        if (avaliacoesCarouselContainer) {
            avaliacoesCarouselContainer.addEventListener('mouseenter', () => {
                clearInterval(avaliacoesAutoSlideInterval);
            });
            
            avaliacoesCarouselContainer.addEventListener('mouseleave', () => {
                clearInterval(avaliacoesAutoSlideInterval);
                avaliacoesAutoSlideInterval = setInterval(autoAvaliacaoSlide, 6000);
            });
        }
    }
});
