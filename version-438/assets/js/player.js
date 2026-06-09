(function () {
    function playVideo(video, layer, streamUrl) {
        var start = function () {
            if (layer) {
                layer.classList.add('is-hidden');
            }

            var promise = video.play();

            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        };

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            start();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });

            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, start);
            return;
        }

        video.src = streamUrl;
        start();
    }

    window.initializeMoviePlayer = function (streamUrl) {
        var video = document.querySelector('[data-player="movie"]');
        var layer = document.querySelector('[data-player-layer]');
        var started = false;

        if (!video || !streamUrl) {
            return;
        }

        function handlePlay() {
            if (started) {
                var promise = video.play();

                if (promise && promise.catch) {
                    promise.catch(function () {});
                }
                return;
            }

            started = true;
            playVideo(video, layer, streamUrl);
        }

        if (layer) {
            layer.addEventListener('click', handlePlay);
        }

        video.addEventListener('click', handlePlay);
    };
})();
