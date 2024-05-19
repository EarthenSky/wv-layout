import { 
    DOWNLOAD_ZIP, PARSE_FILES, LOAD_IMPORTS,
    TEXT_MESSAGE, DOWNLOAD_ZIP_COMPLETE, NEW_PYTHON_FILE, ADD_IMPORTS, LOAD_IMPORTS_COMPLETE
} from './parserWorker.js';
import { createSVGBox, defaultPosition, updateDefaultPosition } from "./gui.js";

// --------------------------- //
// parser thread communication

const parserWorker = new Worker("parserWorker.bundle.js", { type: 'module' });

let owner = "encode"
let repo  = "httpx"
let ref   = "master"

var g_pythonFiles = {};

document.getElementById("loadLayout").addEventListener("click", event => {
    parserWorker.postMessage([DOWNLOAD_ZIP, owner, repo, ref]);
})

parserWorker.onmessage = event => {
    let messageKind = event.data[0];
    if (messageKind == TEXT_MESSAGE) {
        console.log("TEXT_MESSAGE: " + event.data[1]);

    } else if (messageKind == DOWNLOAD_ZIP_COMPLETE) {
        parserWorker.postMessage([PARSE_FILES]);

    } else if (messageKind == NEW_PYTHON_FILE) {
        let path = event.data[1];
        let name = event.data[2];
        g_pythonFiles[path] = {
            path: path,
            name: name,
            imports: [],
        };

        createSVGBox(name, path, defaultPosition());
        updateDefaultPosition();

    } else if (messageKind == ADD_IMPORTS) {
        console.log("TODO: this ...")

    } else {
        console.log("TODO: this ... kind=" + messageKind)
    }
}