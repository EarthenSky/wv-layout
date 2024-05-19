import { samplePython3Code, getImportsFromCode } from './parser.js';
import { JSZip } from "JSZip";

// ----------------------------------------- //
// message kind

// request messages
export const DOWNLOAD_ZIP = 0;
export const PARSE_FILES  = 1;
export const LOAD_IMPORTS = 2;

// response messages
export const TEXT_MESSAGE          = 128 + 0;
export const DOWNLOAD_ZIP_COMPLETE = 128 + 1;
export const NEW_PYTHON_FILE       = 128 + 2;
export const PARSE_FILES_COMPLETE  = 128 + 3;
export const ADD_IMPORTS           = 128 + 4;
export const LOAD_IMPORTS_COMPLETE = 128 + 5;

// ----------------------------------------- //

onmessage = async (event) => {
    let messageKind = event.data[0];
    if (messageKind == DOWNLOAD_ZIP) {
        await downloadZip(event.data[1], event.data[2], event.data[3]);
        postMessage([DOWNLOAD_ZIP_COMPLETE]);

    } else if (messageKind == PARSE_FILES) {
        await parseFilesInZip();
        postMessage([PARSE_FILES_COMPLETE]);
    
    } else if (messageKind == LOAD_IMPORTS) {
        await loadAllImports();
        postMessage([LOAD_IMPORTS_COMPLETE]);
    
    }
};

// ----------------------------------------- //
// behaviour

var g_zipFile = null;
var g_pythonFiles = {};

async function downloadZip(owner, repo, ref) {
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

    console.log("downloaded zip file successfully");
    console.log(githubZipResponse);

    let blob = await githubZipResponse.blob();
    let zipLoader = new JSZip();
    g_zipFile = await zipLoader.loadAsync(blob);
}

async function parseFilesInZip() {
    g_zipFile.forEach((path, file) => {
        if (file.name.endsWith(".py")) {
            let name = file.name.replace(/^.*[\\/]/, '').slice(0, -3);

            g_pythonFiles[file.name] = {
                path: file.name,
                name: name,
                imports: [],
            };

            postMessage([NEW_PYTHON_FILE, file.name, name]);

            //parseFile(file.name);
        }
    });
}

async function loadAllImports() {
    g_pythonFiles.forEach(fileObj => {
        loadImportsFor(fileObj.path);
    });
}

function loadImportsFor(path) {
    g_zipFile.file(path).async("string").then(fileContents => {
        let imports = getImportsFromCode(fileContents);
        g_pythonFiles[path].imports = imports; 
        if (path == "httpx-master/tests/test_wsgi.py" || path == "httpx-master/httpx/_config.py") {
            console.log("python files:")
            console.log(g_pythonFiles)
        }
        postMessage([ADD_IMPORTS, path, imports]);
    });
}
