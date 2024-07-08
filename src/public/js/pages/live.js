const video = document.getElementById('live-video');
const loader = document.querySelector('.loader');
const poster = document.querySelector('.poster');
const playButton = document.getElementById('play');
const fullScreenToggle = document.getElementById('fullscreen-toggle');
const videoContainer = document.querySelector('.video-container');

playButton.addEventListener('click', togglePlay);
fullScreenToggle.addEventListener('click', toggleFullScreen);

video.addEventListener('waiting', () => {
    loader.style.display = "block";
})

video.addEventListener('canplay', () => {
    loader.style.display = "none";
})
video.addEventListener('waiting', () => {
    poster.style.display = "block";
})

video.addEventListener('canplay', () => {
    poster.style.display = "none";
})

fetch('/get-stream-url')
        .then(response => response.json())
        .then(data => {
            const streamUrl = data.url;
            const hls = new Hls();

            if (Hls.isSupported()) {
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            }
        });

function togglePlay() {
    if (video.paused) {
        video.play();
        playButton.innerHTML = '<i class="bi bi-pause-fill"></i>';
    } else {
        video.pause();
        playButton.innerHTML = '<i class="bi bi-play-fill"></i>';
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.mozRequestFullScreen) {
            videoContainer.mozRequestFullScreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
    } else {
        exitFullScreen();
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// Update the fullscreen icon based on fullscreen state
document.addEventListener('fullscreenchange', updateFullScreenIcon);
document.addEventListener('webkitfullscreenchange', updateFullScreenIcon);
document.addEventListener('mozfullscreenchange', updateFullScreenIcon);
document.addEventListener('msfullscreenchange', updateFullScreenIcon);

function updateFullScreenIcon() {
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        fullScreenToggle.innerHTML = '<i class="bi bi-arrows-angle-contract"></i>';
    } else {
        fullScreenToggle.innerHTML = '<i class="bi bi-arrows-angle-expand"></i>';
    }
}

// Update video time display
video.addEventListener('timeupdate', updateTimer);
video.addEventListener('loadedmetadata', updateDuration);

function updateTimer() {
    const currentTime = formatTime(video.currentTime);
    const duration = formatTime(video.duration);
    document.querySelector('.current').textContent = currentTime;
    document.querySelector('.duration').textContent = duration;
}

function updateDuration() {
    document.querySelector('.duration').textContent = formatTime(video.duration);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}