// Importes
import { galleryImages, depoimentos } from './data.js'


// SideBar ------------------------
window.initMenu = function () {
  const menuOpenBtn = document.getElementById('menu-open-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const overlay = document.getElementById('overlay');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-item')
  const header = document.querySelector('.header');

  if (!menuOpenBtn) return;

  function sideBar() {
    overlay.classList.toggle('active');
    navMenu.classList.toggle('active');
    header.classList.toggle('header-with-sidebar');
    document.body.classList.toggle('menu-open');
  }


  menuOpenBtn.addEventListener('click', sideBar);
  menuCloseBtn.addEventListener('click', sideBar);
  
  navLinks.forEach(link => {
    link.addEventListener('click', sideBar);
  });
};

// Gallery ------------------------

window.initGallery = function () {

  const galleryContainer = document.getElementById('gallery-images-container');
  const dotsContainer = document.querySelector('.dots');
  const nextBtn = document.getElementById('nextBtn');
  const previusBtn = document.getElementById('previusBtn');

  if (!galleryContainer || !dotsContainer || !nextBtn || !previusBtn) return;

  let currentIndex = 0;
  let slidesPerView = 1;
  let dots = [];

  galleryImages.forEach((image) => {

    // Adiciona imagem
    const div = document.createElement('div');
    div.classList.add('gallery-images');

    div.innerHTML = `<img src="${image}" alt="Serviço realizado">`

    galleryContainer.appendChild(div);

  })

  const slides = document.querySelectorAll('.gallery-images');

  if (!slides.length) return;

  function updateSlidesPerView() {
    let nextSlidesPerView;

    if (window.innerWidth >= 1024) {

      nextSlidesPerView = 3;

    } else if (window.innerWidth >= 768) {

      nextSlidesPerView = 2;

    } else {

      nextSlidesPerView = 1;
    }

    slidesPerView = Math.min(nextSlidesPerView, slides.length);
    galleryContainer.style.setProperty('--gallery-slides-view', slidesPerView);
    galleryContainer.style.setProperty('--gallery-gap-count', Math.max(slidesPerView - 1, 0));
  }

  function getMaxIndex() {
    return Math.max(slides.length - slidesPerView, 0);
  }

  function getSlideDistance() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(galleryContainer).gap) || 0;

    return slideWidth + gap;
  }

  function createDots() {
    dotsContainer.innerHTML = '';

    for (let index = 0; index <= getMaxIndex(); index++) {
      const dot = document.createElement('span');
      dot.classList.add('dot');

      if (index === currentIndex) {
        dot.classList.add('active');
      }

      dot.addEventListener('click', () => {
        currentIndex = index;
        updateGallery();
        pauseAutoPlay();
      });

      dotsContainer.appendChild(dot);
    }

    dots = dotsContainer.querySelectorAll('.dot');
  }

  function updateGallery() {
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex, maxIndex);

    dots.forEach(dot => {
      dot.classList.remove('active');
    });

    if (dots[currentIndex]) {
      dots[currentIndex].classList.add('active');
    }

    const slideDistance = getSlideDistance();

    galleryContainer.style.transform =
      `translateX(-${currentIndex * slideDistance}px)`;

    const hasMultiplePages = maxIndex > 0;
    nextBtn.disabled = !hasMultiplePages;
    previusBtn.disabled = !hasMultiplePages;
  }

  function nextSlide() {
    currentIndex++;

    if (currentIndex > getMaxIndex()) {
      currentIndex = 0;
    }

    updateGallery();
  }

  // setInterval(nextSlide, 6000);

  nextBtn.addEventListener('click', () => {
    nextSlide();
    pauseAutoPlay();
  });

  function previusSlide() {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = getMaxIndex();
    }

    updateGallery();
}

  previusBtn.addEventListener('click', () => {
    previusSlide();
    pauseAutoPlay();
  });

  let startX = 0;

  galleryContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
  });

  let endX = 0;

  galleryContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      nextSlide();
      pauseAutoPlay();
    }

    if (diff < -50) {
      previusSlide();
      pauseAutoPlay();
    }
  });

  let autoPlay;

  function startAutoPlay() {
    clearInterval(autoPlay);

    autoPlay = setInterval(() => {
      nextSlide();
    }, 6000);
  };

  let autoPlayTimeout;

  function pauseAutoPlay() {
    // para autoplay
    clearInterval(autoPlay);

    // limpa timeout anterior
    clearTimeout(autoPlayTimeout);

    // espera 15s
    autoPlayTimeout = setTimeout(() => {
      startAutoPlay();
    }, 15000);
  }

  window.addEventListener('resize', () => {
    updateSlidesPerView();
    createDots();
    updateGallery();
  });

  updateSlidesPerView();
  createDots();
  updateGallery();
  startAutoPlay();

}

// Testimonials ------------------------
window.initTestimonials = function () {
  const depoimentoContainer = document.querySelector('.testimonials-container');
  const depoimentoDotContainer = document.querySelector('.dots-dep-container');
  const nextBtnDep = document.getElementById('testimonialNextBtn');
  const previusBtnDep = document.getElementById('testimonialPreviusBtn');

  if (!depoimentoContainer || !depoimentoDotContainer || !nextBtnDep || !previusBtnDep) return;

  let currentIndex = 0;
  let slidesPerView = 1;
  let dotsDep = [];

  depoimentos.forEach((dep) => {

    const div = document.createElement('div');
    div.classList.add('testimonials-opinions');

    div.innerHTML = `
      <i class="fa-solid fa-quote-left"></i>
      <p class="testimonials-text">${dep.testimonial}</p>
    `;
    
    const divTestCustomer = document.createElement('div');
    divTestCustomer.classList.add('testimonial-customer');

    divTestCustomer.innerHTML = `<img src="${dep.img}" alt="Foto do cliente">`;
    
    const divCustomerInfo = document.createElement('div');
    divCustomerInfo.classList.add('customer-info');

    divCustomerInfo.innerHTML = `
      <h4 class="customer-name">${dep.name}</h4>
      <p class="customer-city">${dep.city}</p>
    `;

    divTestCustomer.appendChild(divCustomerInfo);

    div.appendChild(divTestCustomer);

    // Adicionar a div no HTML
    depoimentoContainer.appendChild(div);

  })

  // Passar depoimento
  const slidesDep = document.querySelectorAll('.testimonials-opinions');

  if (!slidesDep.length) return;

  function updateSlidesPerViewDep() {
    let nextSlidesPerView;

    if (window.innerWidth >= 768) {

      nextSlidesPerView = 2;

    } else {

      nextSlidesPerView = 1;
    }

    slidesPerView = Math.min(nextSlidesPerView, slidesDep.length);
    depoimentoContainer.style.setProperty('--testimonials-slides-view', slidesPerView);
    depoimentoContainer.style.setProperty('--testimonials-gap-count', Math.max(slidesPerView - 1, 0));
  }

  function getMaxIndexDep() {
    return Math.max(slidesDep.length - slidesPerView, 0);
  }

  function getSlideDistanceDep() {
    const slideWidth = slidesDep[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(depoimentoContainer).gap) || 0;

    return slideWidth + gap;
  }

  function createDotsDep() {
    depoimentoDotContainer.innerHTML = '';

    for (let index = 0; index <= getMaxIndexDep(); index++) {
      const dot = document.createElement('span');
      dot.classList.add('dot-dep');

      if (index === currentIndex) {
        dot.classList.add('active');
      }

      dot.addEventListener('click', () => {
        currentIndex = index;
        updateDep();
        pauseAutoPlayDep();
      });

      depoimentoDotContainer.appendChild(dot);
    }

    dotsDep = depoimentoDotContainer.querySelectorAll('.dot-dep');
  }

  function updateDep() {
    const maxIndex = getMaxIndexDep();
    currentIndex = Math.min(currentIndex, maxIndex);

    slidesDep.forEach(slide => {
      slide.classList.remove('active');
    });

    dotsDep.forEach(dot => {
      dot.classList.remove('active');
    });

    if (slidesDep[currentIndex]) {
      slidesDep[currentIndex].classList.add('active');
    }

    if (dotsDep[currentIndex]) {
      dotsDep[currentIndex].classList.add('active');
    }

    const slideDistance = getSlideDistanceDep();

    depoimentoContainer.style.transform =
      `translateX(-${currentIndex * slideDistance}px)`;

    const hasMultiplePages = maxIndex > 0;
    nextBtnDep.disabled = !hasMultiplePages;
    previusBtnDep.disabled = !hasMultiplePages;
  }

  function nextSlideDep() {
    currentIndex++; 

    if (currentIndex > getMaxIndexDep()) {
      currentIndex = 0;
    }

    updateDep();
  }

  // setInterval(nextSlideDep, 6000);

  function previusSlideDep() {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = getMaxIndexDep();
    } 

    updateDep();
  }

  nextBtnDep.addEventListener('click', () => {
    nextSlideDep();
    pauseAutoPlayDep();
  });

  previusBtnDep.addEventListener('click', () => {
    previusSlideDep();
    pauseAutoPlayDep();
  });

  let startX = 0;

  depoimentoContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
  });

  let endX = 0;

  depoimentoContainer.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      nextSlideDep();
      pauseAutoPlayDep();
    }

    if (diff < -50) {
      previusSlideDep();
      pauseAutoPlayDep();
    }
  });

  let autoPlayDep;

  function startAutoPlayDep() {
    clearInterval(autoPlayDep);

    autoPlayDep = setInterval(() => {
      nextSlideDep();
    }, 6000);
  };

  let autoPlayTimeoutDep;

  function pauseAutoPlayDep() {
    // para autoplay
    clearInterval(autoPlayDep);

    // limpa timeout anterior
    clearTimeout(autoPlayTimeoutDep);

    // espera 15s
    autoPlayTimeoutDep = setTimeout(() => {
      startAutoPlayDep();
    }, 15000);
  }

  window.addEventListener('resize', () => {
    updateSlidesPerViewDep();
    createDotsDep();
    updateDep();
  });

  updateSlidesPerViewDep();
  createDotsDep();
  updateDep();
  startAutoPlayDep();
}
