let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
sidebarBtn.onclick = function () {
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
}


const short_text = document.querySelector('.short-data');
const full_Text = document.querySelector('.full-data');

const mortbtn = document.querySelector('.mortbtn');

let OpenBtn = true; // เก็บค่า state ของปุ่ม

mortbtn.addEventListener('click', () => {
    if (OpenBtn) {
        full_Text.style.display = 'block';
        short_text.style.display = 'none';
        mortbtn.textContent = 'ย่อ';
        OpenBtn = false; // เปลี่ยนค่า state เมื่อปุ่มถูกคลิก
    } else {
        full_Text.style.display = 'none';
        short_text.style.display = 'block';
        mortbtn.textContent = 'ดูต่อ';
        OpenBtn = true; // เปลี่ยนค่า state เมื่อปุ่มถูกคลิก
    }
});