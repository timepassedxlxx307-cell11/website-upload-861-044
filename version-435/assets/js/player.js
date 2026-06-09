(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var video = document.querySelector("video[data-stream]");
    var trigger = document.querySelector("[data-play-trigger]");
    if (!video) {
      return;
    }

    var stream = video.getAttribute("data-stream");
    var attached = false;
    var hlsInstance = null;

    function attachStream() {
      if (attached || !stream) {
        return;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
        attached = true;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
        attached = true;
        return;
      }
      video.src = stream;
      attached = true;
    }

    function startPlayback() {
      attachStream();
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {});
      }
    }

    if (trigger) {
      trigger.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", function () {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    });

    video.addEventListener("pause", function () {
      if (trigger && video.currentTime === 0) {
        trigger.classList.remove("is-hidden");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
