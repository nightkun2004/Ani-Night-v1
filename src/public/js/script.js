document.addEventListener('DOMContentLoaded', function() {
    var toggleBtns = document.querySelectorAll('.nav-left .menus button');

    toggleBtns.forEach(function(btn) {
        btn.addEventListener('mouseover', function() {
            var popupMenu = this.nextElementSibling;
            popupMenu.style.display = 'block';
        });

        btn.addEventListener('mouseout', function() {
            var popupMenu = this.nextElementSibling;
            popupMenu.style.display = 'none';
        });

        // เมื่อเอาเมาส์ออกนอกปุ่มและเมนูป๊อปอัพ
        btn.addEventListener('mouseleave', function(event) {
            var popupMenu = this.nextElementSibling;
            if (!popupMenu.contains(event.relatedTarget)) {
                popupMenu.style.display = 'block';
            }
        });

        var popupMenu = btn.nextElementSibling;
        // เมื่อเอาเมาส์ออกนอกเมนูป๊อปอัพ
        popupMenu.addEventListener('mouseleave', function(event) {
            if (!btn.contains(event.relatedTarget)) {
                popupMenu.style.display = 'none';
            }
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const previousButton = document.querySelector(".previous");
    const nextButton = document.querySelector(".next");
    const articlesContainer = document.querySelector(".articles");

    previousButton.addEventListener("click", function(event) {
        event.preventDefault();
        articlesContainer.scrollBy({
            left: -250, // ขนาดของบทความที่ต้องการเลื่อน
            behavior: "smooth" // การทำงานของการเลื่อน
        });
    });

    nextButton.addEventListener("click", function(event) {
        event.preventDefault();
        articlesContainer.scrollBy({
            left: 250, // ขนาดของบทความที่ต้องการเลื่อน
            behavior: "smooth" // การทำงานของการเลื่อน
        });
    });
});