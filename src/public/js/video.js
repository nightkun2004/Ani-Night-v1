const videos = document.querySelector('.videos');
const videoWidth = 220;

function layout() {
    function getInfo() {
        const videofallWidth = videos.offsetWidth;
        const column = Math.floor(videofallWidth / videoWidth);
        const gapCount = column - 1;
        const freeSpace = videofallWidth - videoWidth * column;
        const gap = freeSpace / gapCount;
        return {
            gap: gap,
            column: column,
        };
    }

    function renderVideosLayout(videosInfo) {
        const videos = document.querySelectorAll('.post-video');
        let currentTop = new Array(videosInfo.column).fill(0);
    
        videos.forEach((video) => {
            const videoHeight = video.offsetHeight + videosInfo.gap;
            const minIndex = currentTop.indexOf(Math.min(...currentTop));
            const leftPos = minIndex * (videoWidth + videosInfo.gap);
    
            // video.style.position = 'absolute';
            video.style.width = videoWidth + 'px'; 
            video.style.transform = `translate(${leftPos}px, ${currentTop[minIndex]}px)`;
            currentTop[minIndex] += videoHeight;
        });

        const maxHeight = Math.max(...currentTop);
        videosContainer.style.height = maxHeight + 'px';
    }
    

    const videosInfo = getInfo();
    renderVideosLayout(videosInfo);
}

const videosContainer = document.querySelector('.videos');
const paginatedVideosData = videosContainer.dataset.paginatedVideos;

if (paginatedVideosData) {
    const paginatedVideos = JSON.parse(paginatedVideosData);
    layout();
} else {
    console.error("Error: No paginatedVideos data found.");
}

window.addEventListener('load', () => layout());
window.addEventListener('resize', () => layout());
window.addEventListener('orientationchange', layout());

// window.addEventListener('load', handleWindowSize);
// window.addEventListener('resize', handleWindowSize);

// function handleWindowSize() {
//     const windowWidth = window.innerWidth;

//     if (windowWidth <= 520) {
//         window.location.href = '/videos/for-you/mobile';
//     }
// }

