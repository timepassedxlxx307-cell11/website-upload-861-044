(function() {
  var navWrap = document.querySelector(".nav-wrap");
  var navToggle = document.querySelector(".nav-toggle");
  if (navWrap && navToggle) {
    navToggle.addEventListener("click", function() {
      var open = navWrap.classList.toggle("menu-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var hero = document.querySelector("[data-hero-carousel]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        var target = Number(dot.getAttribute("data-hero-target") || "0");
        show(target);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll("[data-card-filter]"));
  filterForms.forEach(function(form) {
    var input = form.querySelector("input");
    var grid = document.querySelector("[data-filter-grid]");
    if (!input || !grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));

    function applyFilter() {
      var term = input.value.trim().toLowerCase();
      cards.forEach(function(card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-region") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-type") || "",
          card.getAttribute("data-genre") || "",
          card.textContent || ""
        ].join(" ").toLowerCase();
        card.style.display = !term || haystack.indexOf(term) !== -1 ? "" : "none";
      });
    }

    form.addEventListener("submit", function(event) {
      event.preventDefault();
      applyFilter();
    });
    input.addEventListener("input", applyFilter);
  });

  if (window.MOVIES_INDEX && document.getElementById("search-results")) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var input = document.getElementById("search-input");
    var title = document.getElementById("search-title");
    var results = document.getElementById("search-results");
    if (input) {
      input.value = query;
    }

    function renderSearch(term) {
      var value = term.trim().toLowerCase();
      if (!value) {
        return;
      }
      var matches = window.MOVIES_INDEX.filter(function(movie) {
        return movie.search.indexOf(value) !== -1;
      }).slice(0, 96);
      if (title) {
        title.textContent = "搜索结果";
      }
      if (!matches.length) {
        results.innerHTML = '<div class="no-results">没有找到匹配内容</div>';
        return;
      }
      results.innerHTML = matches.map(function(movie) {
        return [
          '<a class="movie-card movie-card-default" href="./' + movie.file + '" data-title="' + escapeHtml(movie.title) + '">',
          '<figure>',
          '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
          '<span class="card-year">' + escapeHtml(movie.year) + '</span>',
          '<span class="card-channel">' + escapeHtml(movie.category) + '</span>',
          '</figure>',
          '<div class="card-body">',
          '<h2>' + escapeHtml(movie.title) + '</h2>',
          '<p>' + escapeHtml(movie.oneLine) + '</p>',
          '<div class="card-meta">' + escapeHtml(movie.region + ' · ' + movie.type + ' · ' + movie.genre) + '</div>',
          '<div class="tag-row">' + movie.tags.slice(0, 3).map(function(tag) { return '<span>' + escapeHtml(tag) + '</span>'; }).join('') + '</div>',
          '</div>',
          '</a>'
        ].join('');
      }).join('');
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    renderSearch(query);
  }
})();
