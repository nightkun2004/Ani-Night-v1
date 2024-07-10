document.addEventListener('DOMContentLoaded', function () {
    const shareButton = document.getElementById('share-button');
    const sharePopup = document.getElementById('share-popup');
    const copyLinkButton = document.getElementById('copy-link');
    const shareButtons = document.querySelectorAll('.share-button');
    const articleUrl = window.location.href;

    // Toggle share popup
    shareButton.addEventListener('click', function () {
        sharePopup.classList.toggle('hidden');
    });

    // Copy link to clipboard
    copyLinkButton.addEventListener('click', function () {
        navigator.clipboard.writeText(articleUrl).then(() => {
            popupalert.style.display = 'block';
            setTimeout(() => {
                popupalert.style.display = 'none';
            }, 2000);
        }).catch(err => {
            console.error('Error copying link:', err);
        });
    });

    window.fbAsyncInit = function () {
        FB.init({
            appId: '1075150200774995', // ใช้ App ID ของคุณที่ได้จาก Facebook Developer
            cookie: true,
            xfbml: true,
            version: 'v12.0'
        });

        FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    // Share to social platforms
    shareButtons.forEach(button => {
        button.addEventListener('click', function () {
            const platform = this.dataset.platform;
            const articleTitle = document.querySelector('input[name="articleTitle"]').value;
            let shareUrl = '';

            switch (platform) {
                case 'facebook':
                FB.ui({
                    method: 'share',
                    href: articleUrl,
                    quote: articleTitle,
                }, function(response){});
                break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
                    window.open(shareUrl, '_blank');
                    break;
                case 'tiktok':
                    shareUrl = `https://www.tiktok.com/share?url=${encodeURIComponent(articleUrl)}`;
                    window.open(shareUrl, '_blank');
                    break;
                case 'youtube':
                    shareUrl = `https://www.youtube.com/share?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}`;
                    window.open(shareUrl, '_blank');
                    break;
                default:
                    console.error(`Unsupported platform: ${platform}`);
                    break;
            }
            window.open(shareUrl, '_blank');
        });
    });

    // Hide popup when clicking outside
    document.addEventListener('click', function (event) {
        if (!shareButton.contains(event.target) && !sharePopup.contains(event.target)) {
            sharePopup.classList.add('hidden');
        }
    });
});

// Simulate data loading
document.addEventListener("DOMContentLoaded", function () {
    setTimeout(loadContent, 2000); // Simulate loading time
});

function loadContent() {
    // Replace skeletons with actual content
    document.getElementById('main-content').classList.remove('skeleton');

    document.querySelectorAll('.skeleton').forEach((element) => {
        element.classList.remove('skeleton');
    });
}