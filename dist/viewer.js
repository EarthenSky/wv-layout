const svg = document.getElementById('svg');
const g = svg.children[0];

let canvasTranslation = {
    x: 0,
    y: 0,
}

let mouseLocation = {
    x: 0,
    y: 0,
}
let isLeftMouseDown = false;

svg.addEventListener('mousedown', event => {
    if (event.button == 0)
        isLeftMouseDown = true;
});
window.addEventListener('mouseup', event => {
    if (event.button == 0)
        isLeftMouseDown = false;
});
window.addEventListener('mousemove', event => {
    if (isLeftMouseDown) {
        let diffX = event.clientX - mouseLocation.x;
        let diffY = event.clientY - mouseLocation.y;

        canvasTranslation.x += diffX;
        canvasTranslation.y += diffY;

        g.setAttribute("transform", "translate(" + canvasTranslation.x + " " + canvasTranslation.y + ")");
        svg.style.backgroundPosition = canvasTranslation.x + "px " + canvasTranslation.y + "px";
    }

    mouseLocation.x = event.clientX;
    mouseLocation.y = event.clientY;
});

// TODO: add scrolling & coloured bounding boxes for elements -> also movement of boxes & alignment with the grid
