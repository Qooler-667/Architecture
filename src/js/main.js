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

class AutomaticSlider {
  constructor(el) {
    this.slider = el;
    this.track = el.querySelector('.slider__track');
    this.nextBtn = el.querySelector('.next-btn');
    this.prevBtn = el.querySelector('.prev-btn');

    // 1. Поиск текста через проверку родителя (чтобы не упасть в ошибку)
    const parent = this.slider.closest('.project__slider');
    this.textContent = parent
      ? parent.querySelector('.project__slider-content')
      : null;

    if (this.textContent) {
      this.textSlides = Array.from(
        this.textContent.querySelectorAll('.project__slide-desc')
      );
    } else {
      this.textSlides = [];
    }

    // 2. Работа с изображениями
    const rawImages = this.slider.getAttribute('data-images');
    if (!rawImages || rawImages.includes('@@')) return;

    this.images = rawImages.split(',').map((img) => img.trim());

    // 3. Создание слайдов
    this.createSlides();

    // 4. Состояние (slides появятся только ПОСЛЕ createSlides)
    this.slides = Array.from(this.track.children);
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;

    this.init();
  }

  createSlides() {
    if (!this.track) return;
    this.images.forEach((url) => {
      const slide = document.createElement('div');
      slide.classList.add('slider__slide');
      slide.style.backgroundImage = `url(${url})`;
      this.track.appendChild(slide);
    });
  }

  init() {
    if (this.nextBtn)
      this.nextBtn.addEventListener('click', () => this.changeSlide(1));
    if (this.prevBtn)
      this.prevBtn.addEventListener('click', () => this.changeSlide(-1));

    window.addEventListener('resize', () => this.updatePosition());

    if (this.track) {
      this.track.addEventListener('mousedown', (e) => this.dragStart(e));
      this.track.addEventListener('touchstart', (e) => this.dragStart(e));
      window.addEventListener('mousemove', (e) => this.dragMove(e));
      window.addEventListener('touchmove', (e) => this.dragMove(e));
      window.addEventListener('mouseup', () => this.dragEnd());
      window.addEventListener('touchend', () => this.dragEnd());
    }
  }

  changeSlide(direction) {
    this.currentIndex += direction;

    if (this.currentIndex >= this.slides.length) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = this.slides.length - 1;
    }

    this.updatePosition();
  }

  updatePosition() {
    const width = this.slider.offsetWidth;
    this.currentTranslate = this.currentIndex * -width;
    this.prevTranslate = this.currentTranslate;

    if (this.track) {
      this.track.style.transition = 'transform 0.5s ease';
      this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    // СИНХРОНИЗАЦИЯ ТЕКСТА
    // Убираем жесткую проверку количества (this.textSlides.length === this.slides.length),

    if (this.textSlides.length > 0) {
      this.textSlides.forEach((slide) => slide.classList.remove('active'));
      if (this.textSlides[this.currentIndex]) {
        this.textSlides[this.currentIndex].classList.add('active');
      }
    }
  }

  dragStart(e) {
    this.isDragging = true;
    this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    this.track.style.transition = 'none';
  }

  dragMove(e) {
    if (!this.isDragging) return;
    const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    const diff = currentX - this.startX;
    this.currentTranslate = this.prevTranslate + diff;
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  dragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    const movedBy = this.currentTranslate - this.prevTranslate;

    if (movedBy < -100) this.changeSlide(1);
    else if (movedBy > 100) this.changeSlide(-1);
    else this.updatePosition();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.slider').forEach((s) => new AutomaticSlider(s));
});
