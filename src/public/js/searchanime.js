// function searchAnime(query) {
//     if (query === undefined) {
//         return; // ไม่ทำอะไรเมื่อไม่มีค่า query
//     }
//     const trimmedQuery = query.trim();
//     const animeList = document.querySelector(".anime_lists"); 
//     const searchResultContainer = document.getElementById("searchResult");

//     animeList.innerHTML = "";
//     document.getElementById('result').textContent = query;

//     if (trimmedQuery === '') {
//         // ไม่มีคำค้นหา
//         searchResultContainer.style.display = "none";
//         return;
//     }

//     fetch(`/animeboard/search?search=${trimmedQuery}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.length === 0) {
//                 animeList.innerHTML = "<p>ไม่พบผลการค้นหา</p>";
//                 searchResultContainer.style.display = "none";
//                 return;
//             }

//             // สร้างรายการ Anime จากผลลัพธ์การค้นหา
//             data.forEach(animeData => {
//                 // เดือนเมษายน
//                 animeData.animeApril.forEach(anime => {
//                     if (anime.nameAnime.toLowerCase().includes(trimmedQuery.toLowerCase())) {
//                         const animeItem = createAnimeItem(anime);
//                         animeList.appendChild(animeItem);
//                     }
//                 });
//                 // เดือน พฤษภาคม
//                 animeData.animeMay.forEach(anime => {
//                     if (anime.nameAnime.toLowerCase().includes(trimmedQuery.toLowerCase())) {
//                         const animeItem = createAnimeItem(anime);
//                         animeList.appendChild(animeItem);
//                     }
//                 });
//                 // เดือนกรกฏาคม
//                 animeData.animeJuly.forEach(anime => {
//                     if (anime.nameAnime.toLowerCase().includes(trimmedQuery.toLowerCase())) {
//                         const animeItem = createAnimeItem(anime);
//                         animeList.appendChild(animeItem);
//                     }
//                 });
//             });

//             // แสดงผลลัพธ์การค้นหา
//             searchResultContainer.style.display = "block";
//         })
//         .catch(error => {
//             console.error("Error fetching anime data:", error);
//             animeList.innerHTML = "<p>เกิดข้อผิดพลาดขณะค้นหา</p>";
//             searchResultContainer.style.display = "none";
//         });
// }
function filterCategory(category, element) {
    const categoryQuery = document.getElementById('category-query').querySelector('span');
    categoryQuery.textContent = category;

    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.classList.remove('bg-black', 'text-white');
        btn.classList.add('bg-gray-200', 'text-gray-700');
    });

    element.classList.remove('bg-gray-200', 'text-gray-700');
    element.classList.add('bg-black', 'text-white');

    const sections = document.querySelectorAll('search_anime');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show the selected section
    if (category === 'เมษายน') {
        document.getElementById('april_Section').style.display = 'block';
        document.getElementById('may_Section').style.display = 'none';
        document.getElementById('june_Section').style.display = 'none';
        document.getElementById('july_Section').style.display = 'none';
        document.getElementById('August_Section').style.display = 'none';
        document.getElementById('October_Section').style.display = 'none';
    } else if (category === 'พฤษภาคม') {
        document.getElementById('april_Section').style.display = 'none';
        document.getElementById('may_Section').style.display = 'block';
        document.getElementById('june_Section').style.display = 'none';
        document.getElementById('july_Section').style.display = 'none';
        document.getElementById('August_Section').style.display = 'none';
        document.getElementById('October_Section').style.display = 'none';
    } else if (category === 'มิถุนายน') {
        document.getElementById('april_Section').style.display = 'none';
        document.getElementById('may_Section').style.display = 'none';
        document.getElementById('june_Section').style.display = 'block';
        document.getElementById('july_Section').style.display = 'none';
        document.getElementById('August_Section').style.display = 'none';
        document.getElementById('October_Section').style.display = 'none';
    } else if (category === 'กรกฎาคม') {
        document.getElementById('april_Section').style.display = 'none';
        document.getElementById('may_Section').style.display = 'none';
        document.getElementById('june_Section').style.display = 'none';
        document.getElementById('july_Section').style.display = 'block';
        document.getElementById('August_Section').style.display = 'none';
        document.getElementById('October_Section').style.display = 'none';
    } else if (category === 'สิงหาคม') {
        document.getElementById('april_Section').style.display = 'none';
        document.getElementById('may_Section').style.display = 'none';
        document.getElementById('june_Section').style.display = 'none';
        document.getElementById('july_Section').style.display = 'none';
        document.getElementById('August_Section').style.display = 'block';
        document.getElementById('October_Section').style.display = 'none';
    } else if (category === 'ตุลาคม') {
        document.getElementById('april_Section').style.display = 'none';
        document.getElementById('may_Section').style.display = 'none';
        document.getElementById('june_Section').style.display = 'none';
        document.getElementById('july_Section').style.display = 'none';
        document.getElementById('August_Section').style.display = 'none';
        document.getElementById('October_Section').style.display = 'block';
    } else if (category === 'ทั้งหมด') {
        document.getElementById('april_Section').style.display = 'block';
        document.getElementById('may_Section').style.display = 'block';
        document.getElementById('june_Section').style.display = 'block';
        document.getElementById('july_Section').style.display = 'block';
        document.getElementById('August_Section').style.display = 'block';
        document.getElementById('October_Section').style.display = 'block';
    }
}


function createAnimeItem(anime) {
    const animeItem = document.createElement("div");
    animeItem.classList.add("anime_list");
    const animeItemPic = document.createElement("div");
    animeItemPic.classList.add("anime_item_pic");
    const animeImage = document.createElement("img");
    animeImage.src = anime.linkImage;
    animeImage.alt = "Anime";
    animeItemPic.appendChild(animeImage);
    animeItem.appendChild(animeItemPic);
    const animeInfoText = document.createElement("div");
    animeInfoText.classList.add("anime_info_text");
    const animeTitle = document.createElement("h2");
    animeTitle.innerText = anime.nameAnime;
    animeInfoText.appendChild(animeTitle);
    const produceParagraph = document.createElement("p");
    produceParagraph.innerHTML = `ผลิตโดย: <span>${anime.Produced}</span>`;
    animeInfoText.appendChild(produceParagraph);
    if (anime.manuscript) {
        const manuscriptParagraph = document.createElement("p");
        manuscriptParagraph.innerHTML = `ต้นฉบับ: <span>${anime.manuscript}</span>`;
        animeInfoText.appendChild(manuscriptParagraph);
    }
    const episodesParagraph = document.createElement("p");
    episodesParagraph.innerHTML = `จำนวนตอน: <span>${anime.episodes}</span>`;
    animeInfoText.appendChild(episodesParagraph);
    const startParagraph = document.createElement("p");
    startParagraph.innerHTML = `เริ่มฉาย: <span>${anime.start}</span>`;
    animeInfoText.appendChild(startParagraph);

    if (anime.nameep) {
        const nameepParagraph = document.createElement("p");
        nameepParagraph.innerHTML = `ชื่อตอน: <span>${anime.nameep}</span>`;
        animeInfoText.appendChild(nameepParagraph);
    }

    if (anime.info) {
        const infoButton = document.createElement("button");
        infoButton.classList.add("btn_info");
        infoButton.innerHTML = `<a target="_blank" href="${anime.info}">ข้อมูลเพิ่มเติม</a>`;
        animeInfoText.appendChild(infoButton);
    }

    if (anime.web) {
        const webButton = document.createElement("button");
        webButton.classList.add("btn_web", "web");
        webButton.innerHTML = `
            <div class="image">
                <img src="/images/world-wide-web.png" alt="">
            </div>
            <a target="_blank" href="${anime.web}">เว็บทางการ</a>
        `;
        animeInfoText.appendChild(webButton);
    }

    if (anime.bilibili) {
        const bilibiliButton = document.createElement("button");
        bilibiliButton.classList.add("btn_bilibili", "bilibili");
        bilibiliButton.innerHTML = `
            <div class="image">
                <img src="/images/bilibili.png" alt="">
            </div>
            <a target="_blank" href="${anime.bilibili}">ดูบน Bilibili</a>
        `;
        animeInfoText.appendChild(bilibiliButton);
    }

    if (anime.Iqiyi) {
        const iqiyiButton = document.createElement("button");
        iqiyiButton.classList.add("btn_iq", "iq");
        iqiyiButton.innerHTML = `
            <div class="image">
                <img src="/icons/iqiyi-icon.png" alt="">
            </div>
            <a target="_blank" href="${anime.Iqiyi}">ดูบน IQIYI</a>
        `;
        animeInfoText.appendChild(iqiyiButton);
    }

    if (anime.crunchyroll) {
        const crunchyrollButton = document.createElement("button");
        crunchyrollButton.classList.add("btn_crunchyroll", "crunchyroll");
        crunchyrollButton.innerHTML = `
            <div class="image">
                <img src="/icons/crunchyroll_icon.png" alt="">
            </div>
            <a target="_blank" href="${anime.crunchyroll}">ดูบน Crunchyroll</a>
        `;
        animeInfoText.appendChild(crunchyrollButton);
    }

    if (anime.youtube) {
        const youtubeButton = document.createElement("button");
        youtubeButton.classList.add("btn_yt", "yt");
        youtubeButton.innerHTML = `
            <div class="image">
                <img src="/icons/youtube.svg" alt="">
            </div>
            <a target="_blank" class="flex" href="${anime.youtube}">ดูบน YouTube
                ${anime.yt_text ? `<p class="pl-1">${anime.yt_text}</p>` : ""}
            </a>
        `;
        animeInfoText.appendChild(youtubeButton);
    }

    animeItem.appendChild(animeInfoText);

    return animeItem;
}