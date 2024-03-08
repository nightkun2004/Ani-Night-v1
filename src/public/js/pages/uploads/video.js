document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('dropzone-file');
    const previewVideo = document.getElementById('previewVideo');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBar = document.getElementById('progressBar');
    const progressPopup = document.getElementById('progressPopup');
    const progressPercent = document.getElementById('progressPercent');

    fileInput.addEventListener('dragover', function (e) {
        e.preventDefault();
        fileInput.classList.add('dragover');
    });

    fileInput.addEventListener('drop', function (e) {
        e.preventDefault();
        fileInput.classList.remove('dragover');
        handleDroppedFiles(e.dataTransfer.files);
    });

    fileInput.addEventListener('change', function () {
        const selectedFile = this.files[0];
        if (selectedFile) {
            handleSelectedFile(selectedFile);
        }
    });

    function handleDroppedFiles(files) {
        if (files.length > 0) {
            const droppedFile = files[0];
            handleSelectedFile(droppedFile);
        }
    }

    function handleSelectedFile(file) {
        const objectURL = URL.createObjectURL(file);
        previewVideo.src = objectURL;
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBar = document.getElementById('progressBar');
    const progressPopup = document.getElementById('progressPopup');
    const progressPercent = document.getElementById('progressPercent');
    const succeedMessage = document.getElementById('succeed'); 
  
    form.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const formData = new FormData(form);
      const xhr = new XMLHttpRequest();
  
      xhr.upload.addEventListener('progress', function (event) {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          progressBar.style.width = percentComplete + '%';
          progressPercent.textContent = percentComplete.toFixed(0) + '%';
  
          if (percentComplete === 100) {
            succeedMessage.style.display = 'block';
            progressPopup.style.display = 'none';
          }
        }
      });
  
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          progressPopup.style.display = 'none';
        }
      };
  
      xhr.open('POST', '/video-upload', true);
      xhr.send(formData);

      progressPopup.style.display = 'block';
    });
  });
  