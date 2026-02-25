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

    const carouselTrack = document.querySelector('.carousel-track');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (carouselTrack && carouselSlides.length > 0) {
        let currentSlide = 0;
        const totalSlides = carouselSlides.length;
        let autoSlideInterval;
        let isTransitioning = false;
        
        function moveToSlide(slideIndex) {
            if (isTransitioning) return;
            
            isTransitioning = true;
            currentSlide = slideIndex;
            const translateX = slideIndex * 33.33;
            
            carouselTrack.style.transform = `translateX(-${translateX}%)`;
            
           indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });
            
            setTimeout(() => {
                isTransitioning = false;
            }, 500);
        }
        
        function autoSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            moveToSlide(currentSlide);
        }
        
        autoSlideInterval = setInterval(autoSlide, 5000);
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (isTransitioning || currentSlide === index) return;
                
                currentSlide = index;
                moveToSlide(currentSlide);
                
                clearInterval(autoSlideInterval);
                setTimeout(() => {
                    autoSlideInterval = setInterval(autoSlide, 5000);
                }, 5000);
            });
        });
        
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

    const avaliacoesCarouselTrack = document.querySelector('.avaliacoes-carousel-track');
    const avaliacoesSlides = document.querySelectorAll('.avaliacoes-carousel-slide');
    const avaliacoesIndicators = document.querySelectorAll('.avaliacoes-indicator');
    
    if (avaliacoesCarouselTrack && avaliacoesSlides.length > 0) {
        let currentAvaliacaoSlide = 0;
        const totalAvaliacaoSlides = avaliacoesSlides.length;
        let avaliacoesAutoSlideInterval;
        let isAvaliacoesTransitioning = false;
        
        function moveToAvaliacaoSlide(slideIndex) {
            if (isAvaliacoesTransitioning) return;
            
            isAvaliacoesTransitioning = true;
            const translateX = slideIndex * 100;
            
            avaliacoesCarouselTrack.style.transform = `translateX(-${translateX}%)`;
            
            avaliacoesIndicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === slideIndex);
            });
            
            setTimeout(() => {
                isAvaliacoesTransitioning = false;
            }, 600);
        }
        
        function autoAvaliacaoSlide() {
            currentAvaliacaoSlide = (currentAvaliacaoSlide + 1) % totalAvaliacaoSlides;
            moveToAvaliacaoSlide(currentAvaliacaoSlide);
        }
        
        avaliacoesAutoSlideInterval = setInterval(autoAvaliacaoSlide, 6000); // 6 segundos
        
        avaliacoesIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                if (isAvaliacoesTransitioning || currentAvaliacaoSlide === index) return;
                
                currentAvaliacaoSlide = index;
                moveToAvaliacaoSlide(currentAvaliacaoSlide);
                
                clearInterval(avaliacoesAutoSlideInterval);
                setTimeout(() => {
                    avaliacoesAutoSlideInterval = setInterval(autoAvaliacaoSlide, 6000);
                }, 6000);
            });
        });
        
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
