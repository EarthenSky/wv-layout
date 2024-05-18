import { samplePython3Code, getImportsFromCode } from './parser.js'

// TODO: gui.js

let owner = "encode"
let repo  = "httpx"
let ref   = "master"

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

function createSVGBox(name, position) {
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

async function loadLayout() {
    // If only the github api worked correctly in the browser, then I wouldn't have to do this...
    // ref: https://github.com/orgs/community/discussions/106849
    let githubZipResponse = await fetch(
        'https://corsproxy.io/?' + encodeURIComponent("https://codeload.github.com/"+owner+"/"+repo+"/zip/refs/heads/"+ref),
        {
            method: "GET",
            mode: "cors",
            redirect: "manual",
        }
    );

    console.log(githubZipResponse);

    let lastPosition = {
        x: PAD * 0.5,
        y: PAD * 0.5,
    }
    let pythonFiles = {}

    // TODO: create a dict of the python stdlib, or just a list of valid standard library modules
    // Do https://github.com/python/cpython/tree/3.12/Lib & cache it or something

    // TODO: add gui to allow users to import libraries from pip and/or github

    // TODO: needs a loading bar...

    let blob = await githubZipResponse.blob();
    let zipLoader = new JSZip();
    let zipFile = await zipLoader.loadAsync(blob);

    let skip = false;
    zipFile.forEach((path, file) => {
        if (skip) { return; }
        if (file.name == "httpx-master/httpx/_config.py") {
            skip = true;
        }

        if (file.name.endsWith(".py")) {
            let name = file.name.replace(/^.*[\\/]/, '').slice(0, -3);
            pythonFiles[file.name] = {
                path: file.name,
                name: name,
                imports: [],
            };

            createSVGBox(name, lastPosition);
            lastPosition.y += PAD + HEIGHT;

            zipFile.file(file.name).async("string").then(fileContents => {
                pythonFiles[file.name].imports = getImportsFromCode(fileContents)
                console.log(file.name)
                if (file.name == "httpx-master/tests/test_wsgi.py" || file.name == "httpx-master/httpx/_config.py") {
                    console.log("python files:")
                    console.log(pythonFiles)
                }
            });
        }
    });

}

document.getElementById("loadLayout").onclick = async () => {
    await loadLayout();
};

