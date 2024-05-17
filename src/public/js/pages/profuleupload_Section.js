// เลือกทุกปุ่มที่มีคลาส editButton
document.querySelectorAll('.editButton').forEach(button => {
  button.addEventListener('click', () => {
    document.getElementById('editPopup').classList.remove('hidden');
  });
});

// เมื่อคลิกที่ปุ่ม "ปิด"
document.getElementById('closeButton').addEventListener('click', () => {
  document.getElementById('editPopup').classList.add('hidden');
});

// เมื่อคลิกที่ปุ่ม "ยกเลิก"
document.getElementById('cancelButton').addEventListener('click', () => {
  document.getElementById('editPopup').classList.add('hidden');
});
