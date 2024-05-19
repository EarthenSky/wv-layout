// --------------------------- //
// gui constants

// https://lospec.com/palette-list/comfort44s
const colours = {
    pastelYellow: "#f7e5b2",
    lightOrange: "#fcc48d",
    red: "#e64e4b",
    pink: "#df529e",
    green: "#60b37e",
    lightGreen: "#b3daa3",
    pastelGreen: "#cfe8b7",
    purple: "#943ca6",
    lightBlue: "#8ed3dc",
    tan: "#dd8a5b",
}

const PAD = 16;
const MIN_WIDTH = 128;
const HEIGHT = 64;
const svg = document.getElementById('svg');
const g = svg.children[0];

const svgns = "http://www.w3.org/2000/svg";

// --------------------------- //
// globals

var g_lastPosition = {
    x: PAD,
    y: PAD,
}

// --------------------------- //

export function createSVGBox(name, path, position) {
    
    // TODO: use path as a subtitle

    var colouredBox = document.createElementNS(svgns, 'rect');
    colouredBox.setAttribute('fill', colours.lightGreen);
    colouredBox.setAttribute('class', 'box');
    colouredBox.style.setProperty('--hover-color', colours.green);

    var newText = document.createElementNS(svgns, "text");
    newText.textContent = name + ".py";
    newText.setAttribute('class', 'text no-select');
    newText.setAttribute('dominant-baseline', 'middle');
    newText.setAttribute('text-anchor', 'middle');

    var group = document.createElementNS(svgns, 'g');
    group.setAttribute('transform', "translate(" + position.x + " " + position.y + ")");
    group.setAttribute('class', 'parent');
    group.appendChild(colouredBox);
    group.appendChild(newText);

    g.appendChild(group);

    let boxWidth = Math.max(MIN_WIDTH, Math.ceil(newText.getBBox().width / 16 + 2 * PAD / 16) * 16);
    colouredBox.setAttribute('width', boxWidth);
    colouredBox.setAttribute('height', HEIGHT);

    // get properties after the text is rendered
    newText.setAttribute('x', boxWidth * 0.5);
    newText.setAttribute('y', HEIGHT * 0.5);
}

export function defaultPosition() {
    return g_lastPosition;
}

export function updateDefaultPosition() {
    g_lastPosition.y += PAD + HEIGHT;
}
