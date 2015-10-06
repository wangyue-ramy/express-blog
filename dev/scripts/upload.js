function upload() {

    var file = document.getElementById('file');
    var picWrap = document.getElementsByClassName('pic-wrap')[0];
    var banner = document.getElementById('banner');
    var mask = document.getElementsByClassName('mask')[0];
    file.addEventListener('change', preview);
    var state = {};
    var picTop = document.getElementById('picTop');

    function preview(e) {
        var reader = new FileReader();
        reader.onload = function(e) {
            banner.src = this.result;
            banner.addEventListener('mousedown', startMove);
            picWrap.style.cursor = 'move';
        };
        reader.readAsDataURL(file.files[0]);
    }
    function startMove(e) {
        saveState(e);
        document.addEventListener('mousemove', moving);
        document.addEventListener('mouseup', endMove);
    }

    function moving(e) {
        e.preventDefault();
        e.stopPropagation();
        var top = state.bannerTop + e.clientY - state.mouseY;
        top = top > 0 ? 0 : top;
        top = (top < picWrap.offsetHeight - banner.offsetHeight) ? (picWrap.offsetHeight - banner.offsetHeight) : top;
        banner.style.top = top + 'px';
    }

    function endMove(e) {
        picTop.value = banner.offsetTop;
        document.removeEventListener('mousemove', moving, false);
        document.removeEventListener('mouseup', endMove, false);
    }

    function saveState(e) {
        state.bannerTop = banner.offsetTop;
        state.mouseY = e.clientY;
    }

}

window.addEventListener('load', upload);
