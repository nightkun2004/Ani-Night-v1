const video = document.getElementById('live-video');
const loader = document.querySelector('.loader');
const poster = document.querySelector('.poster');
const playButton = document.getElementById('play');
const fullScreenToggle = document.getElementById('fullscreen-toggle');
const videoContainer = document.querySelector('.video-container');
const qualitySelector = document.querySelector('.quality-selector');
const btnQuality = document.getElementById('btnquality');
const qualityList = document.getElementById('quality');
const controls = document.getElementById("controls");

playButton.addEventListener('click', togglePlay);
fullScreenToggle.addEventListener('click', toggleFullScreen);

let mouseMoveTimeout;

    function showControls() {
        controls.classList.remove("hidden");
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            controls.classList.add("hidden");
        }, 3000);
    }

    showControls();

    video.addEventListener("mousemove", showControls);
    video.addEventListener("click", showControls);
    video.addEventListener("touchstart", showControls);
    poster.addEventListener("mousemove", showControls);
    poster.addEventListener("click", showControls);
    poster.addEventListener("touchstart", showControls);

    controls.addEventListener("mousemove", showControls);
    controls.addEventListener("click", showControls);
    controls.addEventListener("touchstart", showControls);

video.addEventListener('waiting', () => {
    loader.style.display = "block";
})

btnQuality.addEventListener("click", () => {
    qualitySelector.classList.toggle("show");
});

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
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play(); // Play the video when ready
            });

            // Add quality levels to the list
            hls.on(Hls.Events.MANIFEST_LOADED, (event, data) => {
                while (qualityList.children.length > 1) {
                    qualityList.removeChild(qualityList.lastChild);
                }
                data.levels.forEach((level, index) => {
                    const li = document.createElement('li');
                    li.dataset.value = index;
                    li.textContent = level.height + 'p';
                    li.classList.add('cursor-pointer', 'py-1');
                    qualityList.appendChild(li);
                });

                qualityList.addEventListener('click', (event) => {
                    const selectedValue = event.target.dataset.value;
                    if (selectedValue === 'auto') {
                        hls.currentLevel = -1; // Auto quality
                    } else {
                        hls.currentLevel = parseInt(selectedValue);
                    }
                    qualityList.querySelectorAll('li').forEach(li => {
                        li.classList.remove('activequality');
                    });
                    event.target.classList.add('activequality');
                });
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.addEventListener('loadedmetadata', () => {
                video.play(); // Play the video when ready
            });
        }
    })
    .catch(error => {
        console.error('Error fetching stream URL:', error);
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

fullScreenToggle.addEventListener("click", () => {
    const videoPlayer = document.querySelector('.video_player');
    if (!videoPlayer.classList.contains("openFullScreen")) {
        videoPlayer.classList.add("openFullScreen");
        fullscreenBtn.innerHTML = '<i class="bi bi-arrows-angle-contract"></i>';
        videoPlayer.requestFullscreen(); // เรียกใช้ fullscreen ของ video player ของคุณ
    } else {
        videoPlayer.classList.remove("openFullScreen");
        fullscreenBtn.innerHTML = '<i class="bi bi-arrows-angle-expand';
        document.exitFullscreen(); // ออกจาก fullscreen ของเบราว์เซอร์
    }
});

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