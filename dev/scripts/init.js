function pageInit() {
    var bannerInit = function() {
        var imgs = document.getElementsByClassName('banner');
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].style.top = imgs[i].getAttribute('data-picTop') + 'px';
        }
    };
    var formInit = function() {
        var rows = document.getElementsByClassName('form-row');
        for (var i = 0; i < rows.length; i++) {
            rows[i].setAttribute('prompt', '');
        }
    };
    bannerInit();
    formInit();
}

window.addEventListener('load', pageInit);
