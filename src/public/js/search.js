// document.addEventListener('DOMContentLoaded', function () {
//     const searchForm = document.querySelector('#search-form');

//     searchForm.addEventListener('submit', function (event) {
//         event.preventDefault();

//         const queryInput = document.querySelector('input[name="query"]');
//         const query = queryInput.value.trim();

//         if (query !== '') {
//             const searchUrl = `/search?query=${encodeURIComponent(query)}`;

//             window.location.href = searchUrl;
//         }
//     });
// });


function searchArticles(query) {
    const searchPopup = document.querySelector('.results_popup');
    const searchList = searchPopup.querySelector('ul');

    // เรียกข้อมูลจากเซิร์ฟเวอร์โดยใช้ AJAX หรือ Fetch API
    fetch(`/search?query=${query}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // เคลียร์ผลลัพธ์ที่แสดงอยู่เดิม
            searchList.innerHTML = '';

            // แสดงผลลัพธ์ที่เกี่ยวข้อง
            data.forEach(article => {
                const li = document.createElement('li');
                li.textContent = article.title;
                searchList.appendChild(li);
            });

            // แสดง popup ผลลัพธ์
            searchPopup.style.display = 'block';
        })
        .catch(error => console.error(error));
}

