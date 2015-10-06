function bannerFormat() {
	var imgs = document.getElementsByClassName('banner');
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].style.top = imgs[i].getAttribute('data-picTop') + 'px';
	}
}

window.addEventListener('load', bannerFormat);