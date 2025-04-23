document.addEventListener('DOMContentLoaded', function() {
    // ===== CÓDIGO DO CARROSSEL =====
    const carousel = document.getElementById('image-carousel');
    const items = document.querySelectorAll('#image-carousel > div');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    let currentIndex = 0;
    let isMobile = window.innerWidth < 768;
    let autoPlayInterval;
    let isAnimating = false;
  
    // Função para atualizar o carrossel
    function updateCarousel() {
      if (isAnimating) return;
      
      isAnimating = true;
      const itemsToShow = isMobile ? 1 : 3;
      const itemWidth = 100 / itemsToShow;
      const offset = -currentIndex * itemWidth;
      
      carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      carousel.style.transform = `translateX(${offset}%)`;
      
      carousel.addEventListener('transitionend', () => {
        isAnimating = false;
        
        // Ajuste para loop infinito suave
        if (currentIndex >= items.length - itemsToShow) {
          setTimeout(() => {
            carousel.style.transition = 'none';
            currentIndex = 0;
            carousel.style.transform = `translateX(0%)`;
            setTimeout(() => {
              carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 50);
          }, 600);
        }
      }, { once: true });
    }
  
    // Navegação para o próximo slide
    function nextSlide() {
      if (isAnimating) return;
      
      const itemsToShow = isMobile ? 1 : 3;
      currentIndex = (currentIndex + 1) % (items.length - itemsToShow + 1);
      updateCarousel();
      resetAutoPlay();
    }
  
    // Navegação para o slide anterior
    function prevSlide() {
      if (isAnimating) return;
      
      const itemsToShow = isMobile ? 1 : 3;
      currentIndex = (currentIndex - 1 + (items.length - itemsToShow + 1)) % (items.length - itemsToShow + 1);
      updateCarousel();
      resetAutoPlay();
    }
  
    // Configura o autoplay
    function setupAutoPlay() {
      autoPlayInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    }
  
    // Reinicia o autoplay
    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      setupAutoPlay();
    }
  
    // Event listeners para os botões
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
  
    // Pausa no hover
    carousel.parentElement.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
  
    carousel.parentElement.addEventListener('mouseleave', () => {
      setupAutoPlay();
    });
  
    // Responsividade
    window.addEventListener('resize', function() {
      const newIsMobile = window.innerWidth < 768;
      if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        currentIndex = Math.min(currentIndex, items.length - (isMobile ? 1 : 3));
        updateCarousel();
      }
    });
  
    // Touch events para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoPlayInterval);
    }, { passive: true });
  
    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      setupAutoPlay();
    }, { passive: true });
  
    function handleSwipe() {
      const threshold = 50;
      
      if (touchEndX < touchStartX - threshold) {
        nextSlide();
      } else if (touchEndX > touchStartX + threshold) {
        prevSlide();
      }
    }
  
    // ===== CÓDIGO DA NAVEGAÇÃO SUAVE =====
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.1 });
  
    document.querySelectorAll('section').forEach(section => {
      sectionObserver.observe(section);
    });
  
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // ===== INICIALIZAÇÃO =====
    // Força o carrossel começar no primeiro item
    currentIndex = 0;
    carousel.style.transition = 'none';
    carousel.style.transform = 'translateX(0%)';
    setTimeout(() => {
      carousel.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }, 50);
    
    setupAutoPlay();
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Ajuste o valor para o seu layout
          behavior: 'smooth' // Desacelera o movimento de rolagem
        });
      }
    });
  });
  // Observador de interseções para animar as seções
const sections = document.querySelectorAll('.section'); // Selecione todas as seções que você quer animar

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate'); // Adiciona a classe de animação quando a seção entra na tela
    }
  });
}, { threshold: 0.5 }); // A seção entra na tela quando 50% dela for visível

sections.forEach(section => {
  observer.observe(section);
});
