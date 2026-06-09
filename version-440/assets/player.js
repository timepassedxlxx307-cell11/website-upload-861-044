
import { H as Hls } from './video-vendor-dru42stk.js';

const configElement = document.getElementById('player-config');
const video = document.getElementById('movie-player');
const playButtons = Array.from(document.querySelectorAll('.js-play'));
const overlay = document.querySelector('.player-overlay');
let prepared = false;
let hls = null;

function readConfig() {
    if (!configElement) {
        return {};
    }
    try {
        return JSON.parse(configElement.textContent || '{}');
    } catch (error) {
        return {};
    }
}

function preparePlayer() {
    if (prepared || !video) {
        return;
    }
    const config = readConfig();
    const url = config.videoUrl || '';
    if (!url) {
        return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    } else if (Hls && Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            maxBufferLength: 30,
            maxMaxBufferLength: 60
        });
        hls.loadSource(url);
        hls.attachMedia(video);
    } else {
        video.src = url;
    }
    prepared = true;
}

async function startPlayback() {
    preparePlayer();
    if (!video) {
        return;
    }
    if (overlay) {
        overlay.classList.add('is-hidden');
    }
    try {
        await video.play();
    } catch (error) {
        if (overlay) {
            overlay.classList.remove('is-hidden');
        }
    }
}

playButtons.forEach(function (button) {
    button.addEventListener('click', startPlayback);
});

if (video) {
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
}

window.addEventListener('beforeunload', function () {
    if (hls) {
        hls.destroy();
    }
});
