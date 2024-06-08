// เริ่มการนับถอยหลังเมื่อโหลดหน้าเว็บ
let countdown = 60;

function startCountdown() {
    let countdown = 60; // รีเซ็ตการนับถอยหลัง
    const intervalId = setInterval(() => {
        countdown--;
        updateCountdownUI(countdown);
        if (countdown <= 0) {
            clearInterval(intervalId);
            const randomScore = [20, 50, 70, 100][Math.floor(Math.random() * 4)];
            saveScoreToDatabase(randomScore);
            showPopup(randomScore);
            // เริ่มนับถอยหลังใหม่เมื่อครบรอบ 60 วินาที
            startCountdown();
        }
    }, 1000);
}

function showPopup(score) {
    const popuppoint = document.getElementById('popuppoint');
    popuppoint.innerText = `คุณได้รับ ${score} คะแนน!`;
    popuppoint.style.display = 'block';
    setTimeout(() => {
        popuppoint.style.display = 'none';
    }, 2000); // ซ่อน Popup หลังจากแสดงเป็นเวลา 2 วินาที
}
// ฟังก์ชันสำหรับแสดงการนับถอยหลังบน UI
function updateCountdownUI(countdown) {
    document.getElementById('countdown-timer').innerText = countdown;
}
// ฟังก์ชันสำหรับบันทึกคะแนนลงในฐานข้อมูล
function saveScoreToDatabase(score) {
    fetch('/api/score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ score: score })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error saving score:', error));
}

startCountdown();
