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

    descriptionSpans.forEach(function (descriptionSpan) {
        var description = descriptionSpan.textContent.trim();
        var descriptionWithLinks = description.replace(/(https?:\/\/\S+)/g, '<a href="$1" target="_blank" style="color: blue;">$1</a>');
        descriptionSpan.innerHTML = descriptionWithLinks;
    });
});

// Open Menus Play
const sidebarOpen = document.getElementById("sidebarOpen");
const menus_play = document.getElementById("menus_play");
let Openmasspopup = false;

sidebarOpen.addEventListener('click', () => {
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

// script.js

// เมื่อคลิกที่ปุ่ม "แสดงความคิดเห็น"
document.querySelectorAll(".btn-comment").forEach(btn => {
    btn.addEventListener("click", async () => {
        const replyText = btn.parentElement.querySelector('input[name="inputcomment"]').value.trim();
        const videoId = btn.getAttribute("data-videoid");

        if (replyText) {
            try {
                // ส่งคำขอ POST เพื่อโพสต์ความคิดเห็นไปยังเซิร์ฟเวอร์
                const response = await fetch("/comment/post/video", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ video_id: videoId, inputcomment: replyText })
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                // ล้างค่าในช่อง input หลังจากส่งข้อความตอบกลับสำเร็จ
                btn.parentElement.querySelector('input[name="inputcomment"]').value = "";
                // แสดงป็อปอัป
                const alertContainer = document.querySelector(".alert_container");
                alertContainer.style.display = "block";
                 // หายไปหลังจาก 3 วินาที
                setTimeout(() => {
                    alertContainer.style.display = "none";
                }, 3000);

                // เพิ่มโพสต์ตอบกลับใหม่ไปยัง DOM ทันที
                const newComment = await response.json();
                renderComment(newComment);

            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
                alert("เกิดข้อผิดพลาดในการส่งข้อความตอบกลับ");
            }
        } else {
            alert("โปรดป้อนข้อความก่อนส่ง");
        }
    });
});

// ฟังก์ชันสำหรับแสดงความคิดเห็นที่ได้รับมา
function renderComment(comment) {
    const commentListWrap = document.querySelector('.comment-list__wrap');

    const listItem = document.createElement('li');
    listItem.classList.add('comment-list__wrap__item');

    // สร้างโค้ด HTML สำหรับแสดงความคิดเห็น
    listItem.innerHTML = `
        <div data-v-a42dab90 class="comment comment--root comment--pc">
            <div class="iconprofile-comment">
                <a href="#">
                    <img src="/icons/bilibili-icon.png" alt="">
                </a>
            </div>
        </div>
        <div class="comment__container">
            <div class="comment__user">
                <a class="comment__name" href="#" target="_blank">
                    <h5>${comment.username}</h5>
                </a>
                <span class="comment__time">${comment.createdAt}</span>
            </div>
            <div class="comment__content">
                <span class="comment-content__text">${comment.content}</span>
            </div>
            <div class="comment__operate">
                <div class="comment__operate__item">
                    <i class="fa-regular fa-thumbs-up"></i>
                    <span class="text-1xl">${comment.likes}</span>
                </div>
                <div class="comment__operate__item report">
                    <i class="fa-regular fa-flag"></i>
                    <span data-v-a42dab90="">รายงาน</span>
                </div>
            </div>
        </div>
    `;

    commentListWrap.appendChild(listItem);
}
document.addEventListener("DOMContentLoaded", () => {
    const likeIcons = document.querySelectorAll('.fa-thumbs-up');

    likeIcons.forEach(icon => {
        icon.addEventListener('click', async () => {
            const videoId = icon.dataset.videoId;
            const commentId = icon.dataset.commentId;
            try {
                const response = await fetch('/video/like', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ videoId, commentId })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const likesCount = document.querySelector('.likes-count');

                if (data && data.likes) {
                    likesCount.textContent = data.likes;
                } else {
                    console.error('No likes data found in response');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    });
});