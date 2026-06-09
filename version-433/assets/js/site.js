(() => {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-site-menu]');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('is-open');
        });
    }

    const topButton = document.querySelector('[data-back-top]');

    if (topButton) {
        window.addEventListener('scroll', () => {
            topButton.classList.toggle('is-visible', window.scrollY > 600);
        });

        topButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    const hero = document.querySelector('[data-hero-slider]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
        let index = 0;

        const showSlide = (nextIndex) => {
            index = (nextIndex + slides.length) % slides.length;

            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(() => {
                showSlide(index + 1);
            }, 5200);
        }
    }

    const heroSearchForms = document.querySelectorAll('[data-hero-search]');

    heroSearchForms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const input = form.querySelector('input');
            const query = input ? input.value.trim() : '';
            const target = query ? `search.html?q=${encodeURIComponent(query)}` : 'search.html';
            window.location.href = target;
        });
    });

    const filterRoot = document.querySelector('[data-filter-root]');

    if (filterRoot) {
        const input = filterRoot.querySelector('[data-filter-input]');
        const typeSelect = filterRoot.querySelector('[data-filter-type]');
        const yearSelect = filterRoot.querySelector('[data-filter-year]');
        const cards = Array.from(filterRoot.querySelectorAll('[data-movie-card]'));
        const empty = filterRoot.querySelector('[data-no-results]');
        const params = new URLSearchParams(window.location.search);
        const initialQuery = params.get('q');

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        const filterCards = () => {
            const query = input ? input.value.trim().toLowerCase() : '';
            const typeValue = typeSelect ? typeSelect.value : '';
            const yearValue = yearSelect ? yearSelect.value : '';
            let visible = 0;

            cards.forEach((card) => {
                const haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags,
                    card.dataset.category
                ].join(' ').toLowerCase();
                const matchedQuery = !query || haystack.includes(query);
                const matchedType = !typeValue || card.dataset.type === typeValue;
                const matchedYear = !yearValue || card.dataset.year === yearValue;
                const matched = matchedQuery && matchedType && matchedYear;
                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        };

        [input, typeSelect, yearSelect].forEach((element) => {
            if (element) {
                element.addEventListener('input', filterCards);
                element.addEventListener('change', filterCards);
            }
        });

        filterCards();
    }

    const startPlayer = (shell) => {
        const video = shell.querySelector('video');
        const source = video ? video.getAttribute('data-stream') : '';

        if (!video || !source) {
            return;
        }

        if (shell.dataset.ready !== 'true') {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                shell._hls = hls;
            } else {
                video.src = source;
            }

            shell.dataset.ready = 'true';
        }

        shell.classList.add('is-playing');
        video.controls = true;
        const result = video.play();

        if (result && typeof result.catch === 'function') {
            result.catch(() => {});
        }
    };

    document.querySelectorAll('[data-player-shell]').forEach((shell) => {
        const button = shell.querySelector('[data-player-button]');
        const poster = shell.querySelector('[data-player-poster]');
        const video = shell.querySelector('video');

        [button, poster].forEach((element) => {
            if (element) {
                element.addEventListener('click', () => startPlayer(shell));
            }
        });

        if (video) {
            video.addEventListener('click', () => {
                if (video.paused) {
                    startPlayer(shell);
                }
            });
        }
    });
})();
