function showLoadingIndicator() {
    document.querySelectorAll('.loadingIndicator').forEach(item => {
        item.style.display = 'block';
    });
    document.querySelectorAll('.loading').forEach(item => {
        item.style.display = 'none';
    });
}

function hideLoadingIndicator() {
    document.querySelectorAll('.loadingIndicator').forEach(item => {
        item.style.display = 'none';
    });
    document.querySelectorAll('.loading').forEach(item => {
        item.style.display = 'block';
    });
}

showLoadingIndicator();

window.addEventListener('load', function () {
    hideLoadingIndicator();
});
