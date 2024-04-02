function searchAnime() {
    // Get the search query from the input field
    const query = document.getElementById("search").value.trim();

    // Clear any previous search results
    const animeList = document.querySelector(".anime_lists");
    animeList.innerHTML = "";

    // Replace this with your actual API call logic
    fetch(`/animeboard/search?search=${query}`)
        .then(response => {
            // Check if response is successful
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if there are any results
            if (data.length === 0) {
                animeList.innerHTML = "<p>ไม่พบผลการค้นหา</p>";
                return;
            }

            // Loop through each anime result
            data.forEach(animeData => {
                // Loop through animeApril array
                animeData.animeApril.forEach(anime => {
                    // Check if anime name matches the search query
                    if (anime.nameAnime.toLowerCase().includes(query.toLowerCase())) {
                        const animeItem = createAnimeItem(anime); // Create anime item
                        animeList.appendChild(animeItem); // Append anime item to anime list
                    }
                });
                animeData.animeMay.forEach(anime => {
                    // Check if anime name matches the search query
                    if (anime.nameAnime.toLowerCase().includes(query.toLowerCase())) {
                        const animeItem = createAnimeItem(anime); // Create anime item
                        animeList.appendChild(animeItem); // Append anime item to anime list
                    }
                });
            });
        })
        .catch(error => {
            console.error("Error fetching anime data:", error);
            animeList.innerHTML = "<p>เกิดข้อผิดพลาดขณะค้นหา</p>"; // Display error message
        });
}


function createAnimeItem(anime) {
    // Create container for each anime
    const animeItem = document.createElement("div");
    animeItem.classList.add("anime_list");

    // Create anime item pic container
    const animeItemPic = document.createElement("div");
    animeItemPic.classList.add("anime_item_pic");

    // Create and append anime image
    const animeImage = document.createElement("img");
    animeImage.src = anime.linkImage;
    animeImage.alt = "Anime";
    animeItemPic.appendChild(animeImage);

    // Append anime item pic to anime item
    animeItem.appendChild(animeItemPic);

    // Create anime info text container
    const animeInfoText = document.createElement("div");
    animeInfoText.classList.add("anime_info_text");

    // Create and append anime title
    const animeTitle = document.createElement("h2");
    animeTitle.innerText = anime.nameAnime;
    animeInfoText.appendChild(animeTitle);

    // Add other anime information as needed
    // Produce
    const produceParagraph = document.createElement("p");
    produceParagraph.innerHTML = `ผลิตโดย: <span>${anime.Produced}</span>`;
    animeInfoText.appendChild(produceParagraph);

    // Manuscript
    if (anime.manuscript) {
        const manuscriptParagraph = document.createElement("p");
        manuscriptParagraph.innerHTML = `ต้นฉบับ: <span>${anime.manuscript}</span>`;
        animeInfoText.appendChild(manuscriptParagraph);
    }

    // Episodes
    const episodesParagraph = document.createElement("p");
    episodesParagraph.innerHTML = `จำนวนตอน: <span>${anime.episodes}</span>`;
    animeInfoText.appendChild(episodesParagraph);

    // Start
    const startParagraph = document.createElement("p");
    startParagraph.innerHTML = `เริ่มฉาย: <span>${anime.start}</span>`;
    animeInfoText.appendChild(startParagraph);

    // Nameep
    if (anime.nameep) {
        const nameepParagraph = document.createElement("p");
        nameepParagraph.innerHTML = `ชื่อตอน: <span>${anime.nameep}</span>`;
        animeInfoText.appendChild(nameepParagraph);
    }

    // Info button
    if (anime.info) {
        const infoButton = document.createElement("button");
        infoButton.classList.add("btn_info");
        infoButton.innerHTML = `<a href="${anime.info}">ข้อมูลเพิ่มเติม</a>`;
        animeInfoText.appendChild(infoButton);
    }

    // Web button
    if (anime.web) {
        const webButton = document.createElement("button");
        webButton.classList.add("btn_web", "web");
        webButton.innerHTML = `
            <div class="image">
                <img src="/images/world-wide-web.png" alt="">
            </div>
            <a href="${anime.web}">เว็บทางการ</a>
        `;
        animeInfoText.appendChild(webButton);
    }

    // Bilibili button
    if (anime.bilibili) {
        const bilibiliButton = document.createElement("button");
        bilibiliButton.classList.add("btn_bilibili", "bilibili");
        bilibiliButton.innerHTML = `
            <div class="image">
                <img src="/images/bilibili.png" alt="">
            </div>
            <a href="${anime.bilibili}">ดูบน Bilibili</a>
        `;
        animeInfoText.appendChild(bilibiliButton);
    }

    // Iqiyi button
    if (anime.Iqiyi) {
        const iqiyiButton = document.createElement("button");
        iqiyiButton.classList.add("btn_iq", "iq");
        iqiyiButton.innerHTML = `
            <div class="image">
                <img src="/icons/iqiyi-icon.png" alt="">
            </div>
            <a href="${anime.Iqiyi}">ดูบน IQIYI</a>
        `;
        animeInfoText.appendChild(iqiyiButton);
    }

    // Crunchyroll button
    if (anime.crunchyroll) {
        const crunchyrollButton = document.createElement("button");
        crunchyrollButton.classList.add("btn_crunchyroll", "crunchyroll");
        crunchyrollButton.innerHTML = `
            <div class="image">
                <img src="/icons/crunchyroll_icon.png" alt="">
            </div>
            <a href="${anime.crunchyroll}">ดูบน Crunchyroll</a>
        `;
        animeInfoText.appendChild(crunchyrollButton);
    }

    // Youtube button
    if (anime.youtube) {
        const youtubeButton = document.createElement("button");
        youtubeButton.classList.add("btn_yt", "yt");
        youtubeButton.innerHTML = `
            <div class="image">
                <img src="/icons/youtube.svg" alt="">
            </div>
            <a class="flex" href="${anime.youtube}">ดูบน YouTube
                ${anime.yt_text ? `<p class="pl-1">${anime.yt_text}</p>` : ""}
            </a>
        `;
        animeInfoText.appendChild(youtubeButton);
    }

    // Append anime info text to anime item
    animeItem.appendChild(animeInfoText);

    return animeItem; // Return created anime item
}
