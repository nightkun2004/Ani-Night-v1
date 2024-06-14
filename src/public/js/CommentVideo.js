const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentsContainer = document.getElementById('comments-container');
const speedInput = document.getElementById('speed-input');

// เมื่อฟอร์มถูกส่ง
commentForm.addEventListener('submit', function(event) {
    event.preventDefault(); // ป้องกันการโหลดหน้าใหม่เมื่อส่งฟอร์ม

    const commentText = commentInput.value.trim(); // ดึงข้อความความคิดเห็น

    if (commentText !== '') {
        addComment(commentText); // เพิ่มความคิดเห็นลงใน comments-container
        commentInput.value = ''; // เคลียร์ช่องใส่ข้อความ
    }
});

// ฟังก์ชันเพิ่มความคิดเห็น
function addComment(commentText) {
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');
    commentElement.innerText = commentText;

    // ตั้งค่าความเร็วของการเคลื่อนที่ตามที่ผู้ใช้กำหนด
    const speed = parseFloat(speedInput.value);
    commentElement.style.animationDuration = `${speed}s`;

    // ตั้งค่าตำแหน่ง y แบบสุ่มใน container
    const containerHeight = commentsContainer.offsetHeight;
    const commentHeight = 24; // กำหนดความสูงของความคิดเห็น
    const randomTop = Math.random() * (containerHeight - commentHeight);
    commentElement.style.top = `${randomTop}px`;

    // เพิ่มความคิดเห็นไปที่ด้านบนของ comments-container
    commentsContainer.appendChild(commentElement);

    // ลบความคิดเห็นหลังจากที่เคลื่อนที่เสร็จ
    commentElement.addEventListener('animationend', () => {
        commentElement.remove();
    });
}
