(function () {
  window.initMoviePlayer = function (source) {
    var video = document.getElementById("movie-player");
    var start = document.getElementById("player-start");
    var hls = null;
    var attached = false;

    if (!video || !source) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function play() {
      attach();
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
      if (start) {
        start.classList.add("is-hidden");
      }
    }

    function pause() {
      video.pause();
    }

    if (start) {
      start.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        pause();
      }
    });

    video.addEventListener("play", function () {
      if (start) {
        start.classList.add("is-hidden");
      }
    });

    video.addEventListener("pause", function () {
      if (start && !video.ended) {
        start.classList.remove("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  };
})();
