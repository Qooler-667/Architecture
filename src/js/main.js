// === burger - open ===
document.addEventListener('DOMContentLoaded', () => {
  const burgerBtn = document.querySelector('.header__burger-btn');
  const burgerMenu = document.querySelector('.burger');
  const exitBtn = document.querySelector('.burger__exit-btn');
  const navLinks = document.querySelectorAll('.burger__item-link');

  const closeMenu = () => {
    burgerMenu.classList.remove('burger-active');
    document.body.style.overflow = '';
    burgerBtn?.setAttribute('aria-expanded', 'false');
  };

  // Открытие
  burgerBtn?.addEventListener('click', () => {
    burgerMenu.classList.add('burger-active');
    document.body.style.overflow = 'hidden';
    burgerBtn.setAttribute('aria-expanded', 'true');
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

// ------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const emailInput = document.querySelector('#email-input');
  const submitBtn = document.querySelector('.form-btn');

  function isValidEmail(email) {
    return email.includes('@') && email.includes('.');
  }

  emailInput.addEventListener('input', () => {
    if (isValidEmail(emailInput.value)) {
      submitBtn.classList.add('is-active');
      submitBtn.disabled = false;
    } else {
      submitBtn.classList.remove('is-active');
      submitBtn.disabled = true;
    }
  });
});
