const yearFilterSelect = document.getElementById('yearFilterSelect');
const startYear = 1964;
const endYear = 2025;
for (let i = endYear; i >= startYear; i--) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    yearFilterSelect.appendChild(option);
}

const monthFilterSelect = document.getElementById('monthFilterSelect');
const months = [
    { value: '01', name: 'มกราคม' },
    { value: '02', name: 'กุมภาพันธ์' },
    { value: '03', name: 'มีนาคม' },
    { value: '04', name: 'เมษายน' },
    { value: '05', name: 'พฤษภาคม' },
    { value: '06', name: 'มิถุนายน' },
    { value: '07', name: 'กรกฎาคม' },
    { value: '08', name: 'สิงหาคม' },
    { value: '09', name: 'กันยายน' },
    { value: '10', name: 'ตุลาคม' },
    { value: '11', name: 'พฤศจิกายน' },
    { value: '12', name: 'ธันวาคม' },
];
months.forEach(month => {
    const option = document.createElement('option');
    option.value = month.value;
    option.textContent = month.name;
    monthFilterSelect.appendChild(option);
});

function filterAnime() {
    const selectedYear = yearFilterSelect.value;
    const selectedMonth = monthFilterSelect.value;
    const selectedSeason = document.getElementById('seasonSelect').value;
    const selectedDub = document.getElementById('dubSelect').value;
    const selectedSub = document.getElementById('subSelect').value;
    const selectedPlatform = document.getElementById('platformSelect').value;
    const searchQuery = document.getElementById('searchanime').value.toLowerCase();
    const allAnimes = document.querySelectorAll('.anime-item');
    allAnimes.forEach(anime => {
        const matchYear = selectedYear === 'all' || anime.dataset.year === selectedYear;
        const matchMonth = selectedMonth === 'all' || anime.dataset.month === selectedMonth;
        const matchSeason = selectedSeason === 'all' || anime.dataset.season === selectedSeason;
        const matchDub = selectedDub === 'all' || anime.dataset.dub === selectedDub;
        const matchSub = selectedSub === 'all' || anime.dataset.sub === selectedSub;
        const platforms = anime.dataset.platforms ? JSON.parse(anime.dataset.platforms) : [];
        console.log('Platforms:', platforms);
        const matchPlatform = selectedPlatform === 'all' || platforms.includes(selectedPlatform);
        console.log('Match Platform:', matchPlatform);
        const matchSearch = anime.querySelector('h3').textContent.toLowerCase().includes(searchQuery);
        if (matchYear && matchMonth && matchSeason && matchDub && matchSub && matchPlatform && matchSearch) {
            anime.classList.remove('hidden');
        } else {
            anime.classList.add('hidden');
        }
    });
}

yearFilterSelect.addEventListener('change', filterAnime);
monthFilterSelect.addEventListener('change', filterAnime);
document.getElementById('seasonSelect').addEventListener('change', filterAnime);
document.getElementById('dubSelect').addEventListener('change', filterAnime);
document.getElementById('subSelect').addEventListener('change', filterAnime);
document.getElementById('platformSelect').addEventListener('change', filterAnime);
document.getElementById('searchanime').addEventListener('input', filterAnime);

document.getElementById('allFilterBtn').addEventListener('click', () => {
    yearFilterSelect.value = 'all';
    monthFilterSelect.value = 'all';
    document.getElementById('seasonSelect').value = 'all';
    document.getElementById('dubSelect').value = 'all';
    document.getElementById('subSelect').value = 'all';
    document.getElementById('platformSelect').value = 'all';
    document.getElementById('searchanime').value = '';
    filterAnime();
});

function updateCountdown() {
    const countdownElements = document.querySelectorAll('.countdown-timer');
    countdownElements.forEach(element => {
        const publicationStartTime = new Date(element.getAttribute('data-publication-start-time'));
        const now = new Date();
        const diff = publicationStartTime - now;

        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            element.textContent = `${days}วัน ${hours}ชั่วโมง ${minutes}นาที ${seconds}วินาที`;
        } else {
            element.textContent = 'เริ่มแล้ววว!';
        }
    });
}

setInterval(updateCountdown, 1000);
document.addEventListener('DOMContentLoaded', updateCountdown);