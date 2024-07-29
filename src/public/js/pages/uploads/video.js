document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formUpload');
  const progressPopup = document.getElementById('progressPopup');
  const succeedPopup = document.getElementById('succeed');
  const progressBar = document.getElementById('progressBar');
  const progressPercent = document.getElementById('progressPercent');
  const previewVideo = document.getElementById('previewVideo');
  const fileInput = document.getElementById('dropzone-file');

  // ฟังก์ชันเพื่ออัปโหลดวีดีโอ
  function uploadVideo(formData) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', form.action, true);

      // แสดงสถานะการอัปโหลด
      progressPopup.style.display = 'block';

      xhr.upload.onprogress = function(event) {
          if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              progressPercent.textContent = `${percentComplete}%`;
              progressBar.style.width = `${percentComplete}%`;
          }
      };

      xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
              // ซ่อนสถานะการอัปโหลดและแสดงข้อความสำเร็จ
              progressPopup.style.display = 'none';
              succeedPopup.style.display = 'block';
          } else {
              console.error('Upload failed:', xhr.responseText);
              // ซ่อนสถานะการอัปโหลดและแสดงข้อความข้อผิดพลาด
              progressPopup.style.display = 'none';
              // แสดงข้อความข้อผิดพลาด (ถ้าต้องการ)
          }
      };

      xhr.onerror = function() {
          console.error('Upload error');
          // ซ่อนสถานะการอัปโหลดและแสดงข้อความข้อผิดพลาด
          progressPopup.style.display = 'none';
      };

      xhr.send(formData);
  }

  form.addEventListener('submit', function(event) {
      event.preventDefault(); // ป้องกันการส่งฟอร์มแบบปกติ

      const formData = new FormData(form);
      uploadVideo(formData);
  });

  // การแสดงตัวอย่างวีดีโอเมื่อเลือกไฟล์
  fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const fileURL = URL.createObjectURL(file);
          previewVideo.src = fileURL;
      }
  });
});