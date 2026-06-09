(function () {
    var headerButton = document.querySelector('[data-nav-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (headerButton && mobilePanel) {
        headerButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function startTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                showSlide(i);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    var searchPage = document.querySelector('[data-search-page]');
    if (searchPage) {
        var input = searchPage.querySelector('[data-search-input]');
        var yearSelect = searchPage.querySelector('[data-year-filter]');
        var categorySelect = searchPage.querySelector('[data-category-filter]');
        var typeSelect = searchPage.querySelector('[data-type-filter]');
        var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-movie-card]'));
        var noResult = searchPage.querySelector('[data-no-result]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';

        if (input && query) {
            input.value = query;
        }

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var word = normalize(input ? input.value : '');
            var year = yearSelect ? yearSelect.value : '';
            var category = categorySelect ? categorySelect.value : '';
            var type = typeSelect ? typeSelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-words'));
                var cardYear = card.getAttribute('data-year') || '';
                var cardCategory = card.getAttribute('data-category') || '';
                var cardType = card.getAttribute('data-type') || '';
                var matched = true;

                if (word && haystack.indexOf(word) === -1) {
                    matched = false;
                }
                if (year && cardYear !== year) {
                    matched = false;
                }
                if (category && cardCategory !== category) {
                    matched = false;
                }
                if (type && cardType !== type) {
                    matched = false;
                }

                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (noResult) {
                noResult.style.display = visible ? 'none' : 'block';
            }
        }

        [input, yearSelect, categorySelect, typeSelect].forEach(function (element) {
            if (element) {
                element.addEventListener('input', applyFilter);
                element.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    }

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
    players.forEach(function (player) {
        var video = player.querySelector('video');
        var overlay = player.querySelector('.play-overlay');
        var stream = player.getAttribute('data-stream');
        var attached = false;
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function attachStream() {
            if (attached) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
                attached = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
                attached = true;
                return;
            }

            video.src = stream;
            attached = true;
        }

        function startVideo() {
            attachStream();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            var playPromise = video.play();
            if (playPromise && playPromise.catch) {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', startVideo);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startVideo();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
})();
