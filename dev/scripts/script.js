var orig_src = new Image();
var event_state = {};
var container;
var img = document.getElementById('img');
var resize_canvas = document.createElement('canvas');
var crop_btn = document.getElementById('btn');
var orig_height = img.clientHeight,
    orig_width = img.clientWidth;
img.style.maxHeight = '450px';
function init() {
    wrap(img).insertBefore(createSpan('resize-handle resize-handle-nw'), img)
        .parentNode.insertBefore(createSpan('resize-handle resize-handle-ne'), img)
        .parentNode.appendChild(createSpan('resize-handle resize-handle-se'))
        .parentNode.appendChild(createSpan('resize-handle resize-handle-sw'));
    orig_src.src = img.src;
    container = document.getElementsByClassName('resize-container')[0];
    container.addEventListener('mousedown', startResize);
    container.addEventListener('mousedown', startMove);
    crop_btn.addEventListener('click', confirm);
}

function startResize(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.className.indexOf('resize-handle') != -1) {
        saveEventStage(e);
        document.addEventListener('mousemove', resizing);
        document.addEventListener('mouseup', endResize);
    }
}

function resizing(e) {
    var width, height, top = container.offsetTop, left = container.offsetLeft;
    var clsName = event_state.event.target.className;
    if (clsName.indexOf('ne') != -1) {
        width = e.clientX - event_state.container_left;
        height = event_state.container_height - (e.clientY - event_state.container_top);
        top = e.clientY - container.offsetParent.offsetTop;
    } else if (clsName.indexOf('nw') != -1) {
        width = event_state.container_width - (e.clientX - event_state.container_left);
        height = event_state.container_height - (e.clientY - event_state.container_top);
        top = e.clientY - container.offsetParent.offsetTop;
        left = e.clientX - container.offsetParent.offsetLeft;
    } else if (clsName.indexOf('se') != -1) {
        width = e.clientX - event_state.container_left;
        height = e.clientY - event_state.container_top;
    } else if (clsName.indexOf('sw') != -1) {
        width = event_state.container_width - (e.clientX - event_state.container_left);
        height = e.clientY - event_state.container_top;
        left = e.clientX - container.offsetParent.offsetLeft;
    }
    resizeImage(width, height);
    container.style.top = top + 'px';
    container.style.left = left + 'px';
}

function resizeImage(width, height) {
    img.style.width = width + 'px';
    img.style.height = height + 'px';
}

function endResize(e) {
    document.removeEventListener('mousemove', resizing, false);
    document.removeEventListener('mouseup', endResize, false);
}

function startMove(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.nodeName.toLowerCase() == 'img') {
        saveEventStage(e);
        document.addEventListener('mousemove', moving);
        document.addEventListener('mouseup', endMove);
    }
}

function moving(e) {
    var top = event_state.container_top + e.clientY - event_state.mouseY - container.offsetParent.offsetTop,
        left = event_state.container_left + e.clientX - event_state.mouseX - container.offsetParent.offsetLeft;
    container.style.top = top + 'px';
    container.style.left = left + 'px';
}

function endMove(e) {
    document.removeEventListener('mousemove', moving, false);
    document.removeEventListener('mouseup', endMove, false);
}

function confirm(e) {
    var hRatio = orig_height / img.clientHeight,
        wRatio = orig_width / img.clientWidth;
    var crop_canvas, overlay = document.getElementById('overlay');
    var left = (overlay.offsetLeft - container.offsetLeft) * wRatio,
        top = (overlay.offsetTop - container.offsetTop) * hRatio,
        width = overlay.clientWidth * wRatio,
        height = overlay.clientHeight * hRatio;

    crop_canvas = document.createElement('canvas');
    crop_canvas.width = width;
    crop_canvas.height = height;
    crop_canvas.getContext('2d').drawImage(img, left, top, width, height, 0, 0, width / wRatio, height / hRatio);
    window.open(crop_canvas.toDataURL('image/png'));

}

function saveEventStage(e) {
    var offset = getOffset(container);
    event_state.container_width = container.offsetWidth;
    event_state.container_height = container.offsetHeight;
    event_state.container_left = offset.left;
    event_state.container_top = offset.top;
    event_state.mouseX = e.clientX;
    event_state.mouseY = e.clientY;
    event_state.event = e;
}


function wrap(element) {
    var newDiv = document.createElement('div');
    var wrapDiv = document.getElementsByClassName('screenshot-wrap')[0];
    newDiv.className = 'resize-container';
    wrapDiv.insertBefore(newDiv, element);
    newDiv.appendChild(element);
    return newDiv;
}

function createSpan(clsName) {
    var span = document.createElement('span');
    span.className = clsName;
    return span;
}

function getOffset(element) {
    var actualOffsetLeft = element.offsetLeft,
        actualOffsetTop = element.offsetTop,
        current = element.offsetParent;
    while (current !== null) {
        actualOffsetLeft += current.offsetLeft;
        actualOffsetTop += current.offsetTop;
        current = current.offsetParent;
    }
    return {
        left: actualOffsetLeft,
        top: actualOffsetTop,
    };
}



function getMousePosition(e) {
    console.log(e.clientX, e.clientY);
}

document.addEventListener('click', getMousePosition);
window.addEventListener('load', init);
