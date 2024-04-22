// const dropArea = document.querySelector(".drop_box"),
//   button = dropArea.querySelector(".btn_sump"), // แก้ selector ให้ตรงกับคลาส
//   dragText = dropArea.querySelector(".header_edit_file"), // แก้ selector ให้ตรงกับคลาส
//   input = dropArea.querySelector(".input_fileedit"); // แก้ selector ให้ตรงกับคลาส

// button.onclick = (event) => {
//     event.preventDefault(); 
//   input.click();
// };

// input.addEventListener("change", function (e) {
//   var fileName = e.target.files[0].name;
//   let filedata = `
//     <h4>${fileName}</h4>`;
//   dropArea.innerHTML = filedata;
// });

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("openEdit");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}