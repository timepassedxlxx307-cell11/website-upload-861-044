(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function setupNavigation() {
    var toggle = document.querySelector(".mobile-toggle");
    var nav = document.querySelector(".site-nav");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupBackTop() {
    var button = document.querySelector(".back-top");
    if (!button) {
      return;
    }
    window.addEventListener("scroll", function () {
      button.classList.toggle("show", window.scrollY > 480);
    });
    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-carousel]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(root.querySelectorAll(".hero-dot"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(target) {
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, pos) {
        slide.classList.toggle("active", pos === index);
      });
      dots.forEach(function (dot, pos) {
        dot.classList.toggle("active", pos === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide")) || 0);
        start();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var input = document.querySelector(".filter-input");
    var scope = document.querySelector("[data-filter-scope]");
    if (!input || !scope) {
      return;
    }
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
    var noResults = document.querySelector(".no-results");
    var category = "all";
    var type = "all";
    var categoryButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var typeButtons = Array.prototype.slice.call(document.querySelectorAll("[data-type-filter]"));
    var params = new URLSearchParams(window.location.search);
    var initial = params.get("q");
    if (initial) {
      input.value = initial;
    }

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function apply() {
      var query = normalize(input.value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute("data-text"));
        var cardCategory = card.getAttribute("data-category") || "";
        var cardType = card.getAttribute("data-type") || "";
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchCategory = category === "all" || cardCategory === category;
        var matchType = type === "all" || cardType.indexOf(type) !== -1;
        var show = matchQuery && matchCategory && matchType;
        card.hidden = !show;
        if (show) {
          visible += 1;
        }
      });
      if (noResults) {
        noResults.hidden = visible !== 0;
      }
    }

    categoryButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        category = button.getAttribute("data-filter") || "all";
        categoryButtons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        apply();
      });
    });
    typeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        type = button.getAttribute("data-type-filter") || "all";
        typeButtons.forEach(function (item) {
          item.classList.toggle("active", item === button);
        });
        apply();
      });
    });
    input.addEventListener("input", apply);
    apply();
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    players.forEach(function (shell) {
      var video = shell.querySelector("video");
      var button = shell.querySelector(".player-start");
      var message = shell.querySelector(".player-message");
      var source = shell.getAttribute("data-video-url");
      var loaded = false;
      var hls = null;

      function setMessage(text) {
        if (message) {
          message.textContent = text || "";
        }
      }

      function load() {
        if (loaded || !video || !source) {
          return;
        }
        loaded = true;
        setMessage("正在加载播放源");
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            setMessage("");
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              setMessage("视频加载失败，请稍后重试");
              try {
                hls.destroy();
              } catch (error) {}
            }
          });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          video.addEventListener("loadedmetadata", function () {
            setMessage("");
          }, { once: true });
        } else {
          setMessage("当前浏览器不支持此播放格式");
        }
      }

      function play() {
        load();
        if (!video) {
          return;
        }
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            setMessage("请再次点击播放");
          });
        }
      }

      if (button) {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          play();
        });
      }
      if (video) {
        video.addEventListener("click", function () {
          if (video.paused) {
            play();
          }
        });
        video.addEventListener("play", function () {
          shell.classList.add("is-playing");
          setMessage("");
        });
        video.addEventListener("pause", function () {
          shell.classList.remove("is-playing");
        });
      }
      window.addEventListener("beforeunload", function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  ready(function () {
    setupNavigation();
    setupBackTop();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
