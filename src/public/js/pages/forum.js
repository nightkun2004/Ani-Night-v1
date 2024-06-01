const btnlikes = document.querySelectorAll(".btnlike");
btnlikes.forEach(btnlike => {
    btnlike.addEventListener('click', (e) => {
        e.preventDefault();
        const forumId = btnlike.dataset.forumid; // ดึงค่า ID ของโพสต์ที่ถูกกดไลค์
        fetch(`/forum/${forumId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // อัพเดทจำนวนการกดใจบนหน้าเว็บไซต์
                const heartIcon = btnlike.querySelector('i');
                const likesCount = document.getElementById(`likes-count-${forumId}`);
                const currentLikes = parseInt(likesCount.textContent);
                likesCount.textContent = currentLikes + 1;
                heartIcon.style.color = 'red'; // เปลี่ยนสีไอคอนเป็นสีแดง
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
});

const btnBookmarks = document.querySelectorAll(".btnbookmark");
btnBookmarks.forEach(btnBookmark => {
    btnBookmark.addEventListener('click', (e) => {
        e.preventDefault();
        const forumId = btnBookmark.getAttribute("data-forumid");
        fetch(`/forum/${forumId}/bookmark`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Update bookmark count on the webpage
                const bookmarkCount = document.getElementById("bookmarkCount");
                const currentCount = parseInt(bookmarkCount.textContent);
                bookmarkCount.textContent = currentCount + 1;
                // Update button appearance (optional)
                btnBookmark.style.color = 'orange'; // Change color to indicate bookmarked
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });
});

document.querySelectorAll(".btn-reply").forEach(btn => {
    btn.addEventListener("click", async () => {
        const replyText = btn.parentElement.querySelector('input[name="replybox"]').value.trim();
        const forumId = btn.getAttribute("data-forumid");

        if (replyText) {
            try {
                const response = await fetch("/reply", { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ forumId, replyText })
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                // ล้างค่าในช่อง input หลังจากส่งข้อความตอบกลับสำเร็จ
                btn.parentElement.querySelector('input[name="replybox"]').value = "";
                alert("ตอบกลับเรียบร้อยแล้ว!");

            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
                alert("เกิดข้อผิดพลาดในการส่งข้อความตอบกลับ");
            }
        } else {
            alert("โปรดป้อนข้อความก่อนส่ง");
        }
    });
});


const modalToggleBtns = document.querySelectorAll('[data-modal-toggle]');
modalToggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        const modalId = this.dataset.modalToggle;
        const modal = document.getElementById(modalId);
        modal.classList.remove('opacity-0');
        modal.classList.remove('pointer-events-none');
        document.body.classList.add('modal-active');
    });
});

// ปิด modal
const modalCloseBtns = document.querySelectorAll('[data-modal-close]');
modalCloseBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        const modalId = this.dataset.modalClose;
        const modal = document.getElementById(modalId);
        modal.classList.add('opacity-0');
        modal.classList.add('pointer-events-none');
        document.body.classList.remove('modal-active');
    });
}); 