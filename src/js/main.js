// === burger - open ===
document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.header__burger-btn');
  const burgerMenu = document.querySelector('.burger');
  const exitBtn = document.querySelector('.burger__exit-btn');
  const navLinks = document.querySelectorAll('.burger__item-link');

  const closeMenu = () => {
    burgerMenu.classList.remove('burger-active');
    document.body.style.overflow = '';
  };

  // Открытие
  burgerBtn?.addEventListener('click', () => {
    burgerMenu.classList.add('burger-active');
    document.body.style.overflow = 'hidden';
  });

  // Закрытие по крестику
  exitBtn?.addEventListener('click', closeMenu);

  // Закрытие по ссылкам
  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Закрытие по клику вне меню (по фону .burger)
  burgerMenu?.addEventListener('click', (e) => {
    if (e.target === burgerMenu) {
      closeMenu();
    }
  });
});
// -----------------------------------------

// === Slider ===

// class AutomaticSlider {
//   constructor(el) {
//     this.slider = el;
//     this.track = el.querySelector('.slider__track');
//     this.nextBtn = el.querySelector('.next-btn');
//     this.prevBtn = el.querySelector('.prev-btn');

//     // 1. Поиск текста через проверку родителя (чтобы не упасть в ошибку)
//     const parent = this.slider.closest('.project__slider');
//     this.textContent = parent
//       ? parent.querySelector('.project__slider-content')
//       : null;

//     if (this.textContent) {
//       this.textSlides = Array.from(
//         this.textContent.querySelectorAll('.project__slide-desc')
//       );
//     } else {
//       this.textSlides = [];
//     }

//     // 2. Работа с изображениями
//     const rawImages = this.slider.getAttribute('data-images');
//     if (!rawImages || rawImages.includes('@@')) return;

//     this.images = rawImages.split(',').map((img) => img.trim());

//     // 3. Создание слайдов
//     this.createSlides();

//     // 4. Состояние (slides появятся только ПОСЛЕ createSlides)
//     this.slides = Array.from(this.track.children);
//     this.currentIndex = 0;
//     this.isDragging = false;
//     this.startX = 0;
//     this.currentTranslate = 0;
//     this.prevTranslate = 0;

//     this.init();
//   }

//   createSlides() {
//     if (!this.track) return;
//     this.images.forEach((url) => {
//       const slide = document.createElement('div');
//       slide.classList.add('slider__slide');
//       slide.style.backgroundImage = `url(${url})`;
//       this.track.appendChild(slide);
//     });
//   }

//   init() {
//     if (this.nextBtn)
//       this.nextBtn.addEventListener('click', () => this.changeSlide(1));
//     if (this.prevBtn)
//       this.prevBtn.addEventListener('click', () => this.changeSlide(-1));

//     window.addEventListener('resize', () => this.updatePosition());

//     if (this.track) {
//       this.track.addEventListener('mousedown', (e) => this.dragStart(e));
//       this.track.addEventListener('touchstart', (e) => this.dragStart(e));
//       window.addEventListener('mousemove', (e) => this.dragMove(e));
//       window.addEventListener('touchmove', (e) => this.dragMove(e));
//       window.addEventListener('mouseup', () => this.dragEnd());
//       window.addEventListener('touchend', () => this.dragEnd());
//     }
//   }

//   changeSlide(direction) {
//     this.currentIndex += direction;

//     if (this.currentIndex >= this.slides.length) {
//       this.currentIndex = 0;
//     } else if (this.currentIndex < 0) {
//       this.currentIndex = this.slides.length - 1;
//     }

//     this.updatePosition();
//   }

//   updatePosition() {
//     const width = this.slider.offsetWidth;
//     this.currentTranslate = this.currentIndex * -width;
//     this.prevTranslate = this.currentTranslate;

//     if (this.track) {
//       this.track.style.transition = 'transform 0.5s ease';
//       this.track.style.transform = `translateX(${this.currentTranslate}px)`;
//     }

//     // СИНХРОНИЗАЦИЯ ТЕКСТА
//     // Убираем жесткую проверку количества (this.textSlides.length === this.slides.length),

//     if (this.textSlides.length > 0) {
//       this.textSlides.forEach((slide) => slide.classList.remove('active'));
//       if (this.textSlides[this.currentIndex]) {
//         this.textSlides[this.currentIndex].classList.add('active');
//       }
//     }
//   }

//   dragStart(e) {
//     this.isDragging = true;
//     this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
//     this.track.style.transition = 'none';
//   }

//   dragMove(e) {
//     if (!this.isDragging) return;
//     const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
//     const diff = currentX - this.startX;
//     this.currentTranslate = this.prevTranslate + diff;
//     this.track.style.transform = `translateX(${this.currentTranslate}px)`;
//   }

//   dragEnd() {
//     if (!this.isDragging) return;
//     this.isDragging = false;
//     const movedBy = this.currentTranslate - this.prevTranslate;

//     if (movedBy < -100) this.changeSlide(1);
//     else if (movedBy > 100) this.changeSlide(-1);
//     else this.updatePosition();
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.slider').forEach((s) => new AutomaticSlider(s));
// });

// class BaseSlider {
//   constructor(el) {
//     this.slider = el;
//     this.track = el.querySelector('.slider__track');
//     this.nextBtn = el.querySelector('.next-btn');
//     this.prevBtn = el.querySelector('.prev-btn');

//     if (!this.track) return;

//     this.currentIndex = 0;
//     this.isDragging = false;
//     this.startX = 0;
//     this.currentTranslate = 0;
//     this.prevTranslate = 0;

//     // Слайды определим позже, чтобы дочерние классы успели их создать
//     this.slides = [];
//   }

//   // Вынесем инициализацию в отдельный метод, чтобы запускать её ПОСЛЕ создания слайдов
//   init() {
//     this.slides = Array.from(this.track.children);
//     if (this.slides.length === 0) return;

//     if (this.nextBtn) this.nextBtn.onclick = () => this.changeSlide(1);
//     if (this.prevBtn) this.prevBtn.onclick = () => this.changeSlide(-1);

//     window.addEventListener('resize', () => this.updatePosition());

//     this.track.addEventListener('mousedown', (e) => this.dragStart(e));
//     this.track.addEventListener('touchstart', (e) => this.dragStart(e), {
//       passive: true,
//     });
//     window.addEventListener('mousemove', (e) => this.dragMove(e));
//     window.addEventListener('touchmove', (e) => this.dragMove(e), {
//       passive: false,
//     });
//     window.addEventListener('mouseup', () => this.dragEnd());
//     window.addEventListener('touchend', () => this.dragEnd());

//     this.updatePosition();
//   }

//   changeSlide(direction) {
//     if (!this.slides.length) return;
//     this.currentIndex += direction;

//     if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
//     else if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;

//     this.updatePosition();
//     if (this.onSlideChange) this.onSlideChange(this.currentIndex);
//   }

//   updatePosition() {
//     const width = this.slider.offsetWidth;
//     this.currentTranslate = this.currentIndex * -width;
//     this.prevTranslate = this.currentTranslate;
//     this.track.style.transition = 'transform 0.5s ease';
//     this.track.style.transform = `translateX(${this.currentTranslate}px)`;
//   }

//   dragStart(e) {
//     this.isDragging = true;
//     this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
//     this.track.style.transition = 'none';
//   }

//   dragMove(e) {
//     if (!this.isDragging) return;
//     const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
//     const diff = currentX - this.startX;
//     this.currentTranslate = this.prevTranslate + diff;
//     this.track.style.transform = `translateX(${this.currentTranslate}px)`;
//   }

//   dragEnd() {
//     if (!this.isDragging) return;
//     this.isDragging = false;
//     const movedBy = this.currentTranslate - this.prevTranslate;
//     if (movedBy < -100) this.changeSlide(1);
//     else if (movedBy > 100) this.changeSlide(-1);
//     else this.updatePosition();
//   }
// }

// class ProjectSlider extends BaseSlider {
//   constructor(el) {
//     super(el); // Только подготавливает переменные

//     const rawImages = this.slider.getAttribute('data-images');
//     if (rawImages && !rawImages.includes('@@')) {
//       this.images = rawImages.split(',').map((img) => img.trim());
//       this.renderImages();
//     }

//     // Ищем текст
//     const parent = this.slider.closest('.project__slider');
//     this.textContent = parent
//       ? parent.querySelector('.project__slider-content')
//       : null;
//     this.textSlides = this.textContent
//       ? Array.from(this.textContent.querySelectorAll('.project__slide-desc'))
//       : [];

//     // Запускаем инициализацию базы только КОГДА ВСЁ ГОТОВО
//     this.init();
//   }

//   renderImages() {
//     this.track.innerHTML = '';
//     this.images.forEach((url) => {
//       const slide = document.createElement('div');
//       slide.className = 'slider__slide';
//       slide.style.backgroundImage = `url(${url})`;
//       this.track.appendChild(slide);
//     });
//   }

//   onSlideChange(index) {
//     if (this.textSlides.length > 0) {
//       this.textSlides.forEach((s) => s.classList.remove('active'));
//       if (this.textSlides[index])
//         this.textSlides[index].classList.add('active');
//     }
//   }
// }

// // ЗАПУСК
// document.addEventListener('DOMContentLoaded', () => {
//   // Проекты и Hero (если там картинки из data-images)
//   document
//     .querySelectorAll('.hero__slider .slider, .project__slider .slider')
//     .forEach((s) => {
//       new ProjectSlider(s);
//     });

//   // Отзывы (карточки уже в HTML)
//   document.querySelectorAll('.review__slider').forEach((s) => {
//     const slider = new BaseSlider(s);
//     slider.init(); // Запускаем вручную для базового класса
//   });
// });

// ------------------------------------------------------------------
// class BaseSlider {
//   constructor(el) {
//     this.slider = el;
//     // Универсальный поиск трека для всех типов слайдеров
//     this.track =
//       el.querySelector('.slider__track') ||
//       el.querySelector('.review__slider-track');
//     this.nextBtn = el.querySelector('.next-btn');
//     this.prevBtn = el.querySelector('.prev-btn');

//     if (!this.track) return;

//     this.currentIndex = 0;
//     this.isDragging = false;
//     this.startX = 0;
//     this.currentTranslate = 0;
//     this.prevTranslate = 0;
//     this.slides = [];
//   }

//   init() {
//     this.slides = Array.from(this.track.children);
//     if (this.slides.length === 0) return;

//     if (this.nextBtn) this.nextBtn.onclick = () => this.changeSlide(1);
//     if (this.prevBtn) this.prevBtn.onclick = () => this.changeSlide(-1);

//     window.addEventListener('resize', () => {
//       // При ресайзе с мобилки на десктоп сбрасываем положение для отзывов
//       if (
//         this.slider.classList.contains('review__slider') &&
//         window.innerWidth > 375
//       ) {
//         this.resetPosition();
//       } else {
//         this.updatePosition();
//       }
//     });

//     this.track.addEventListener('mousedown', (e) => this.dragStart(e));
//     this.track.addEventListener('touchstart', (e) => this.dragStart(e), {
//       passive: true,
//     });

//     window.addEventListener('mousemove', (e) => this.dragMove(e));
//     window.addEventListener('touchmove', (e) => this.dragMove(e), {
//       passive: false,
//     });
//     window.addEventListener('mouseup', () => this.dragEnd());
//     window.addEventListener('touchend', () => this.dragEnd());

//     this.updatePosition();
//   }

//   // Проверка: нужно ли вообще крутить этот слайдер сейчас?
//   shouldScroll() {
//     if (this.slider.classList.contains('review__slider')) {
//       return window.innerWidth <= 375;
//     }
//     return true; // Остальные слайдеры (Hero, Projects) крутим всегда
//   }

//   changeSlide(direction) {
//     if (!this.shouldScroll() || !this.slides.length) return;

//     this.currentIndex += direction;

//     if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
//     else if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;

//     this.updatePosition();
//     if (this.onSlideChange) this.onSlideChange(this.currentIndex);
//   }

//   updatePosition() {
//     if (!this.shouldScroll()) return;

//     const width = this.slider.offsetWidth;
//     this.currentTranslate = this.currentIndex * -width;
//     this.prevTranslate = this.currentTranslate;
//     this.track.style.transition = 'transform 0.5s ease';
//     this.track.style.transform = `translateX(${this.currentTranslate}px)`;
//   }

//   resetPosition() {
//     this.currentIndex = 0;
//     this.currentTranslate = 0;
//     this.prevTranslate = 0;
//     this.track.style.transform = 'none';
//     this.track.style.transition = 'none';
//   }

//   dragStart(e) {
//     if (!this.shouldScroll()) return;
//     this.isDragging = true;
//     this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
//     this.track.style.transition = 'none';
//   }

//   dragMove(e) {
//     if (!this.isDragging || !this.shouldScroll()) return;
//     const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
//     const diff = currentX - this.startX;
//     this.currentTranslate = this.prevTranslate + diff;
//     this.track.style.transform = `translateX(${this.currentTranslate}px)`;
//   }

//   dragEnd() {
//     if (!this.isDragging) return;
//     this.isDragging = false;
//     const movedBy = this.currentTranslate - this.prevTranslate;

//     // Порог свайпа 100px
//     if (movedBy < -100) this.changeSlide(1);
//     else if (movedBy > 100) this.changeSlide(-1);
//     else this.updatePosition();
//   }
// }

// class ProjectSlider extends BaseSlider {
//   constructor(el) {
//     super(el);
//     const rawImages = this.slider.getAttribute('data-images');

//     if (rawImages && !rawImages.includes('@@')) {
//       this.images = rawImages.split(',').map((img) => img.trim());
//       this.renderImages();
//     }

//     const parent = this.slider.closest('.project__slider');
//     this.textContent = parent
//       ? parent.querySelector('.project__slider-content')
//       : null;
//     this.textSlides = this.textContent
//       ? Array.from(this.textContent.querySelectorAll('.project__slide-desc'))
//       : [];

//     this.init();
//   }

//   renderImages() {
//     this.track.innerHTML = '';
//     this.images.forEach((url) => {
//       const slide = document.createElement('div');
//       slide.className = 'slider__slide';
//       slide.style.backgroundImage = `url(${url})`;
//       this.track.appendChild(slide);
//     });
//   }

//   onSlideChange(index) {
//     if (this.textSlides.length > 0) {
//       this.textSlides.forEach((s) => s.classList.remove('active'));
//       if (this.textSlides[index])
//         this.textSlides[index].classList.add('active');
//     }
//   }
// }

// // Запуск при загрузке DOM
// document.addEventListener('DOMContentLoaded', () => {
//   // Слайдеры проектов и Hero (динамические)
//   document
//     .querySelectorAll('.hero__slider .slider, .project__slider .slider')
//     .forEach((s) => {
//       new ProjectSlider(s);
//     });

//   // Слайдер отзывов (статический в HTML)
//   document.querySelectorAll('.review__slider').forEach((s) => {
//     const slider = new BaseSlider(s);
//     slider.init();
//   });
// });

// -------------------------------------------------------------
class BaseSlider {
  constructor(el) {
    this.slider = el;
    this.track =
      el.querySelector('.slider__track') ||
      el.querySelector('.review__slider-track');
    this.nextBtn = el.querySelector('.next-btn');
    this.prevBtn = el.querySelector('.prev-btn');

    if (!this.track) return;

    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0; // Добавили для отслеживания вертикального сдвига
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.slides = [];

    this.moveHandler = this.dragMove.bind(this);
    this.endHandler = this.dragEnd.bind(this);
  }

  init() {
    this.slides = Array.from(this.track.children);
    if (this.slides.length === 0) return;

    if (this.nextBtn)
      this.nextBtn.addEventListener('click', () => this.changeSlide(1));
    if (this.prevBtn)
      this.prevBtn.addEventListener('click', () => this.changeSlide(-1));

    this.track.addEventListener('mousedown', (e) => this.dragStart(e));
    this.track.addEventListener('touchstart', (e) => this.dragStart(e), {
      passive: false,
    });

    this.updatePosition();
  }

  shouldScroll() {
    // Увеличили порог, так как многие телефоны шире 375px
    if (this.slider.classList.contains('review__slider')) {
      return window.innerWidth <= 480;
    }
    return true;
  }

  getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  getPositionY(e) {
    return e.type.includes('mouse') ? e.pageY : e.touches[0].clientY;
  }

  changeSlide(direction) {
    if (!this.shouldScroll() || !this.slides.length) return;

    this.currentIndex += direction;

    if (this.currentIndex >= this.slides.length) this.currentIndex = 0;
    else if (this.currentIndex < 0) this.currentIndex = this.slides.length - 1;

    this.updatePosition();
    if (this.onSlideChange) this.onSlideChange(this.currentIndex);
  }

  updatePosition() {
    if (!this.shouldScroll()) {
      this.resetPosition();
      return;
    }

    const width = this.slider.offsetWidth;
    this.currentTranslate = this.currentIndex * -width;
    this.prevTranslate = this.currentTranslate;

    this.track.style.transition = 'transform 0.4s ease-out';
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  resetPosition() {
    if (
      this.slider.classList.contains('review__slider') &&
      window.innerWidth > 480
    ) {
      this.currentIndex = 0;
      this.currentTranslate = 0;
      this.prevTranslate = 0;
      this.track.style.transform = 'none';
      this.track.style.transition = 'none';
    }
  }

  dragStart(e) {
    if (!this.shouldScroll()) return;

    this.isDragging = true;
    this.startX = this.getPositionX(e);
    this.startY = this.getPositionY(e);

    // Фиксируем точку старта относительно текущего индекса
    this.prevTranslate = this.currentIndex * -this.slider.offsetWidth;

    this.track.style.transition = 'none';

    if (e.type === 'mousedown') e.preventDefault();

    window.addEventListener('mousemove', this.moveHandler);
    window.addEventListener('mouseup', this.endHandler);
    window.addEventListener('touchmove', this.moveHandler, { passive: false });
    window.addEventListener('touchend', this.endHandler);
  }

  dragMove(e) {
    if (!this.isDragging) return;

    const currentX = this.getPositionX(e);
    const currentY = this.getPositionY(e);

    const diffX = currentX - this.startX;
    const diffY = currentY - this.startY;

    // Если тянем по горизонтали сильнее, чем по вертикали — блокируем скролл страницы
    if (e.type === 'touchmove') {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (e.cancelable) e.preventDefault();
      } else {
        // Если юзер явно скроллит вниз, отменяем перетаскивание слайдера
        this.dragEnd();
        return;
      }
    }

    this.currentTranslate = this.prevTranslate + diffX;
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    window.removeEventListener('mousemove', this.moveHandler);
    window.removeEventListener('mouseup', this.endHandler);
    window.removeEventListener('touchmove', this.moveHandler);
    window.removeEventListener('touchend', this.endHandler);

    const movedBy = this.currentTranslate - this.prevTranslate;
    const threshold = this.slider.offsetWidth / 5;

    if (movedBy < -threshold) {
      this.changeSlide(1);
    } else if (movedBy > threshold) {
      this.changeSlide(-1);
    } else {
      this.updatePosition();
    }
  }
}

class ProjectSlider extends BaseSlider {
  constructor(el) {
    super(el);
    const rawImages = this.slider.getAttribute('data-images');

    if (rawImages && !rawImages.includes('@@')) {
      this.images = rawImages.split(',').map((img) => img.trim());
      this.renderImages();
    }

    const parent = this.slider.closest('.project__slider');
    this.textContent = parent
      ? parent.querySelector('.project__slider-content')
      : null;
    this.textSlides = this.textContent
      ? Array.from(this.textContent.querySelectorAll('.project__slide-desc'))
      : [];

    this.init();
  }

  renderImages() {
    if (!this.images) return;
    this.track.innerHTML = '';
    this.images.forEach((url) => {
      const slide = document.createElement('div');
      slide.className = 'slider__slide';
      slide.style.backgroundImage = `url(${url})`;
      this.track.appendChild(slide);
    });
  }

  onSlideChange(index) {
    if (this.textSlides.length > 0) {
      this.textSlides.forEach((s) => s.classList.remove('active'));
      if (this.textSlides[index])
        this.textSlides[index].classList.add('active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const allSliders = [];

  document
    .querySelectorAll('.hero__slider .slider, .project__slider .slider')
    .forEach((s) => {
      allSliders.push(new ProjectSlider(s));
    });

  document.querySelectorAll('.review__slider').forEach((s) => {
    const slider = new BaseSlider(s);
    slider.init();
    allSliders.push(slider);
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      allSliders.forEach((slider) => slider.updatePosition());
    }, 100);
  });
});
