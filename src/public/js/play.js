const short_text = document.querySelector('.short-text');
const full_Text = document.querySelector('.full-text');

// ปุ่มเพิ่มคำอธิบาย 
const more_Btn = document.querySelector('.more-btn');
const less_Btn = document.querySelector('.less-btn');

more_Btn.addEventListener('click', () => {
    full_Text.style.display = 'block';
    short_text.style.display = 'none';
    more_Btn.style.display = 'none';
    less_Btn.style.display = 'block';
});

less_Btn.addEventListener('click', () => {
    full_Text.style.display = 'none';
    short_text.style.display = 'block';
    more_Btn.style.display = 'block';
    less_Btn.style.display = 'none';
});

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
  