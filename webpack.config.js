import path from 'path';
import { fileURLToPath } from "url";

// for ES6
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: "development",
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: "module",
        },
    },
    experiments: {
        outputModule: true,
    },
    resolve: {
        fallback: {
            fs: false
        }
    }
};