(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileMenu = document.querySelector(".mobile-menu");
    if (toggle && mobileMenu) {
      toggle.addEventListener("click", function () {
        var open = mobileMenu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startHero() {
      if (slides.length < 2) {
        return;
      }
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        var index = Number(dot.getAttribute("data-hero-dot"));
        showSlide(index);
        startHero();
      });
    });
    startHero();

    Array.prototype.slice.call(document.querySelectorAll("[data-local-filter]")).forEach(function (form) {
      var input = form.querySelector("[data-filter-input]");
      var grid = document.querySelector("[data-filter-grid]");
      var empty = document.querySelector("[data-empty-state]");
      if (!input || !grid) {
        return;
      }
      var items = Array.prototype.slice.call(grid.children);
      function applyFilter() {
        var query = input.value.trim().toLowerCase();
        var visible = 0;
        items.forEach(function (item) {
          var haystack = [item.getAttribute("data-title"), item.getAttribute("data-year"), item.getAttribute("data-category"), item.getAttribute("data-tags")].join(" ").toLowerCase();
          var match = !query || haystack.indexOf(query) !== -1;
          item.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        applyFilter();
      });
      input.addEventListener("input", applyFilter);
      applyFilter();
    });

    var searchForm = document.querySelector("[data-search-page-form]");
    var searchInput = document.querySelector("[data-search-page-input]");
    var categorySelect = document.querySelector("[data-category-select]");
    var searchGrid = document.querySelector("[data-search-grid]");
    var empty = document.querySelector("[data-empty-state]");
    if (searchForm && searchInput && searchGrid) {
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q") || "";
      searchInput.value = initialQuery;
      var searchItems = Array.prototype.slice.call(searchGrid.children);
      function applySearch() {
        var query = searchInput.value.trim().toLowerCase();
        var category = categorySelect ? categorySelect.value : "";
        var visible = 0;
        searchItems.forEach(function (item) {
          var haystack = [item.getAttribute("data-title"), item.getAttribute("data-year"), item.getAttribute("data-category"), item.getAttribute("data-tags")].join(" ").toLowerCase();
          var itemCategory = item.getAttribute("data-category") || "";
          var matchQuery = !query || haystack.indexOf(query) !== -1;
          var matchCategory = !category || itemCategory === category;
          var match = matchQuery && matchCategory;
          item.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        applySearch();
        var params = new URLSearchParams();
        if (searchInput.value.trim()) {
          params.set("q", searchInput.value.trim());
        }
        var nextUrl = params.toString() ? "search.html?" + params.toString() : "search.html";
        window.history.replaceState(null, "", nextUrl);
      });
      searchInput.addEventListener("input", applySearch);
      if (categorySelect) {
        categorySelect.addEventListener("change", applySearch);
      }
      applySearch();
    }
  });
})();
