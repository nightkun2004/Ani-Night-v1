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

                // เพิ่มโพสต์ตอบกลับใหม่ไปยัง DOM
                const replyData = await response.json();
                const replyContainer = document.querySelector(".reply-container");
                const newPost = document.createElement("li");
                newPost.classList.add("border-l", "p-2", "flex", "content-center", "bg-gray-200", "rounded-lg", "mt-2", "mb-");
                newPost.innerHTML = `
                    <div class="flex">
                        <a href="/editor/${replyData.username.username}" target="_blank" rel="noopener noreferrer">
                            <img src="/profiles/${replyData.username.profile}" alt="profile" class="w-10 h10" style="border-radius: 50px;">
                        </a>
                        <div class="relative flex items-center justify-between">
                            <p class="pl-2">${replyData.username.id.username}</p>
                        </div>                                                    
                    </div>
                    <div class="flex flex-col">
                        <h2 class="text-sm text-slate-950">${replyData.username.username}</h2>
                        <p>${replyData.content}</p>
                        <p class="text-sm text-gray-400">${replyData.formattedTimeAgo}</p>
                    </div>
                `;
                replyContainer.appendChild(newPost);

            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
                alert("เกิดข้อผิดพลาดในการส่งข้อความตอบกลับ");
            }
        } else {
            alert("โปรดป้อนข้อความก่อนส่ง");
        }
    });
});

// Get the buttons that open the modals
const modalToggleBtns = document.querySelectorAll('[data-modal-toggle^="reply-modal-"]');

// Get the <span> elements that close the modals
const modalCloseBtns = document.querySelectorAll('[data-modal-close^="reply-modal-"]');

// When the user clicks the button, open the corresponding modal
modalToggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        const modalId = this.dataset.modalToggle;
        const modal = document.getElementById(modalId);
        modal.style.display = 'block';
    });
});

// When the user clicks on <span> (x), close the corresponding modal
modalCloseBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
        const modalId = this.dataset.modalClose;
        const modal = document.getElementById(modalId);
        modal.style.display = 'none';
    });
});

