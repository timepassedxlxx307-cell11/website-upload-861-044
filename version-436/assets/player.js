function initMoviePlayer(videoId, triggerId, stream) {
  var video = document.getElementById(videoId);
  var trigger = document.getElementById(triggerId);
  var ready = false;

  if (!video || !stream) {
    return;
  }

  function attach() {
    if (ready) {
      return Promise.resolve();
    }

    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = stream;
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(stream);
      hls.attachMedia(video);
      return new Promise(function(resolve) {
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          resolve();
        });
      });
    }

    video.src = stream;
    return Promise.resolve();
  }

  function play() {
    attach().then(function() {
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function() {});
      }
    });
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
  }

  if (trigger) {
    trigger.addEventListener("click", play);
  }

  video.addEventListener("click", function() {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener("play", function() {
    if (trigger) {
      trigger.classList.add("is-hidden");
    }
  });
}
