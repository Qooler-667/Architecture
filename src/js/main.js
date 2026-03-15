document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.slider__track');
  const slides = document.querySelectorAll('.slider__item');
  const nextBtn = document.querySelector('.next-btn');
  const prevBtn = document.querySelector('.prev-btn');

  let currentIndex = 0;
  let startX = 0;
  let isDragging = false; // Флаг: нажата ли кнопка мыши

  const updateSlider = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  // Универсальные функции начала и конца движения
  const dragStart = (e) => {
    isDragging = true;
    startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  };

  const dragEnd = (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.type.includes('mouse')
      ? e.pageX
      : e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0)
        currentIndex = Math.min(currentIndex + 1, slides.length - 1);
      else currentIndex = Math.max(currentIndex - 1, 0);
      updateSlider();
    }
  };

  // Слушатели для мыши
  track.addEventListener('mousedown', dragStart);
  track.addEventListener('mouseup', dragEnd);
  track.addEventListener('mouseleave', () => (isDragging = false)); // Чтобы не "залипало" при уходе мыши

  // Слушатели для тач-событий (сенсоры)
  track.addEventListener('touchstart', dragStart);
  track.addEventListener('touchend', dragEnd);

  // Кнопки
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
  });
});
