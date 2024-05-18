const svg = document.getElementById('svg');
const g = svg.children[0];

let canvasTransform = {
    x: 0,
    y: 0,
    scale: 1.0,
}
function updateCanvasTransform() {
    g.setAttribute("transform", "translate(" + canvasTransform.x + " " + canvasTransform.y + ") scale(" + canvasTransform.scale + ")");
    svg.style.backgroundPosition = (canvasTransform.x + 0) + "px " + (canvasTransform.y + 0) + "px";
    svg.style.backgroundSize = 16*canvasTransform.scale + "px";
}
updateCanvasTransform();

let mouseLocation = {
    x: 0,
    y: 0,
}
let moveCanvas = false;
let moveTarget = null;

// This function assumes the group has only one transform, translate
function getGroupTranslate(group) {
    let transformString = group.getAttribute("transform");
    let x = parseFloat(transformString.split(" ")[0].split("(")[1]);
    let y = parseFloat(transformString.split(" ")[1]);
    return [x, y];
}
function setGroupTranslate(group, x, y) {
    group.setAttribute("transform", "translate(" + (x) + " " + (y) + ")");
}

svg.addEventListener('mousedown', event => {
    if (event.button == 0) {
        if (event.target == svg) {
            moveCanvas = true;
        } else {
            // try to move the target
            let targetGroup = event.target.closest("g");
            if (targetGroup !== g) {
                moveTarget = targetGroup;
                moveTarget.parentElement.appendChild(moveTarget); // bring to front
            }
        }
    }
});
window.addEventListener('mouseup', event => {
    if (event.button == 0) {
        moveCanvas = false;

        if (moveTarget !== null) {
            // TODO: ensure that boxes can't overlap, and that they'll be lerped over 0.2s to the closet free location.
            // TODO: how to determine the direction of least density? at least an approximation would be nice...

            // ensure moveTarget snaps to grid before dropping it
            let [x, y] = getGroupTranslate(moveTarget);
            setGroupTranslate(
                moveTarget,
                Math.round(x / 16) * 16, 
                Math.round(y / 16) * 16,
            );
            moveTarget = null;
        }
    }
});
window.addEventListener('mousemove', event => {
    let diffX = event.clientX - mouseLocation.x;
    let diffY = event.clientY - mouseLocation.y;

    if (moveCanvas) {
        canvasTransform.x += diffX;
        canvasTransform.y += diffY;

        updateCanvasTransform();
    } else if (moveTarget !== null) {
        let [x, y] = getGroupTranslate(moveTarget);
        setGroupTranslate(moveTarget, x + diffX / canvasTransform.scale, y + diffY / canvasTransform.scale);
    }

    mouseLocation.x = event.clientX;
    mouseLocation.y = event.clientY;
});
// TODO: fix scaling to be per-location
svg.addEventListener("wheel", event => {
    canvasTransform.scale *= 1.0 - event.deltaY/1000;
    if (canvasTransform.scale < 0.01) 
        canvasTransform.scale = 0.01;
    updateCanvasTransform();
});
