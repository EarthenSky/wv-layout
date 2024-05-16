import { samplePython3Code, getImportsFromCode } from './bundle.js';

let owner = "encode"
let repo  = "httpx"
let ref   = "master"

const PAD = 20;
const WIDTH = 120;
const HEIGHT = 80;
const svg = document.getElementById('svg');
const g = svg.children[0];

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
        x: PAD,
        y: PAD,
    }
    let pythonFiles = {}

    // TODO: create a dict of the python stdlib, or just a list of valid standard library modules
    // Do https://github.com/python/cpython/tree/3.12/Lib & cache it or something

    // TODO: add gui to allow users to import libraries from pip and/or github

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

            const svgns = "http://www.w3.org/2000/svg";
            var fileElement = document.createElementNS(svgns, 'rect');
            fileElement.setAttribute('x', '150');
            fileElement.setAttribute('y', '150');
            fileElement.setAttribute('height', HEIGHT);
            fileElement.setAttribute('width', WIDTH);

            var newText = document.createElementNS(svgns, "text");
            var textNode = document.createTextNode(name);
            newText.appendChild(textNode);
            newText.setAttribute('x', lastPosition.x);
            newText.setAttribute('y', lastPosition.y);

            fileElement.appendChild(newText)
            
            g.appendChild(newText);

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

