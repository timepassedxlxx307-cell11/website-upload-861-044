(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');

    if (toggle && panel) {
        toggle.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function applyFiltering() {
        var input = document.querySelector('[data-filter-input]');
        var select = document.querySelector('[data-filter-category]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card="movie"]'));

        if (!cards.length) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        if (input && initialQuery) {
            input.value = initialQuery;
        }

        function update() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var category = select ? select.value : 'all';

            cards.forEach(function (card) {
                var text = card.getAttribute('data-search') || '';
                var cardCategory = card.getAttribute('data-category') || '';
                var matchesText = !query || text.indexOf(query) !== -1;
                var matchesCategory = category === 'all' || cardCategory === category;
                card.classList.toggle('is-hidden', !(matchesText && matchesCategory));
            });
        }

        if (input) {
            input.addEventListener('input', update);
        }

        if (select) {
            select.addEventListener('change', update);
        }

        update();
    }

    applyFiltering();
})();
