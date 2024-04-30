const short_text = document.querySelectorAll('.short-text');
const full_Text = document.querySelectorAll('.full-text');

// ปุ่มเพิ่มคำอธิบาย 
const more_Btn = document.querySelectorAll('.more-btn');
const less_Btn = document.querySelectorAll('.less-btn');

// Loop ทุก more_Btn และ less_Btn และใส่ Event Listener เข้าไป
more_Btn.forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        const fullText = parent.querySelector('.full-text');
        const shortText = parent.querySelector('.short-text');
        const lessBtn = parent.querySelector('.less-btn');
        
        fullText.style.display = 'block';
        shortText.style.display = 'none';
        btn.style.display = 'none';
        lessBtn.style.display = 'block';
    });
});

less_Btn.forEach(btn => {
    btn.addEventListener('click', () => {
        const parent = btn.parentElement;
        const fullText = parent.querySelector('.full-text');
        const shortText = parent.querySelector('.short-text');
        const moreBtn = parent.querySelector('.more-btn');

        fullText.style.display = 'none';
        shortText.style.display = 'block';
        moreBtn.style.display = 'block';
        btn.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var descriptionSpans = document.querySelectorAll('.full-text');
    
    descriptionSpans.forEach(function(descriptionSpan) {
        var description = descriptionSpan.textContent.trim();
        var descriptionWithLinks = description.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank" style="color: blue;">$1</a>');
        descriptionSpan.innerHTML = descriptionWithLinks;
    });
});

// Open Menus Play
const sidebarOpen = document.getElementById("sidebarOpen");
const menus_play = document.getElementById("menus_play");
let Openmasspopup = false;

sidebarOpen.addEventListener('click', ()=>{
    if (!Openmasspopup) {
        menus_play.style.display = 'block';
        Openmasspopup = true;
    } else {
        menus_play.style.display = 'none';
        Openmasspopup = false;
    }
})

// ========================================================================================= //
const ratingInputs = document.querySelectorAll('.rating input');
const ratingNumber = document.querySelector('.rating-number');

ratingInputs.forEach(input => {
    input.addEventListener('change', () => {
        const value = input.value;
        ratingNumber.textContent = value;
    });
});

// // จัดการเหตุการณ์เมื่อมีการเลือกคะแนน
// document.querySelectorAll('.rating input').forEach(input => {
//     input.addEventListener('change', () => {
//       document.getElementById('ratingNumber').textContent = input.value + " ดาว";
//     });
//   });
  
//   // ส่งคะแนนไปยังเซิร์ฟเวอร์โดยไม่ต้องรีโหลดหน้า
//   document.getElementById('ratingForm').addEventListener('submit', async (event) => {
//     event.preventDefault(); // ป้องกันการโหลดหน้าใหม่
//     const formData = new FormData(event.target); // ดึงข้อมูลจากฟอร์ม
//     const response = await fetch(event.target.action, {
//       method: 'POST',
//       body: formData
//     });
//     if (response.ok) {
//       // อัปเดตข้อมูลหน้าโดยไม่ต้องโหลดหน้าใหม่
//       const data = await response.json();
//       console.log(data.message);
//     } else {
//       console.error('Failed to submit rating');
//     }
//   });
  