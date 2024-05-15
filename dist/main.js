import { samplePython3Code, getImportsFromCode } from './bundle.js';
import { Octokit } from "https://esm.sh/@octokit/rest";

const octokit = new Octokit({
    userAgent: 'wv-layout',
    baseUrl: 'https://api.github.com',
})

let owner = "encode"
let repo  = "httpx"
let ref   = "master"

let zip = await octokit.request(
    'GET /repos/{owner}/{repo}/zipball/{ref}', 
    {
        owner: owner,
        repo: repo,
        ref: ref,
        headers: {
            "Access-Control-Allow-Origin": "*",
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }
)

zip = fetch();
console.log(zip);

getImportsFromCode(samplePython3Code);
console.log("done parsing!");