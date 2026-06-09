
(function () {
    const menuButton = document.querySelector('.menu-button');
    const mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('.hero-dot'));
    let current = 0;
    let timer = null;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === current);
        });
    }

    function startSlider() {
        if (slides.length < 2) {
            return;
        }
        timer = window.setInterval(function () {
            setSlide(current + 1);
        }, 5200);
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            if (timer) {
                window.clearInterval(timer);
            }
            setSlide(i);
            startSlider();
        });
    });

    startSlider();

    const searchInputs = Array.from(document.querySelectorAll('.search-input'));
    const searchableItems = Array.from(document.querySelectorAll('.searchable-item'));

    function search(value) {
        const keyword = value.trim().toLowerCase();
        searchableItems.forEach(function (item) {
            const text = [
                item.dataset.title || '',
                item.dataset.region || '',
                item.dataset.genre || '',
                item.dataset.tags || '',
                item.textContent || ''
            ].join(' ').toLowerCase();
            item.classList.toggle('is-hidden', Boolean(keyword) && !text.includes(keyword));
        });
    }

    searchInputs.forEach(function (input) {
        input.addEventListener('input', function () {
            search(input.value);
        });
    });
})();
