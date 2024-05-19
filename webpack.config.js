import path from 'path';
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackTagsPlugin from 'html-webpack-tags-plugin';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';

// for ES6
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    mode: "development",
    entry: {
        main: './src/main.js',
        viewer: './src/viewer.js',
        parserWorker: './src/parserWorker.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "src/index.html",
            scriptLoading: "module",
        }),
        new HtmlWebpackTagsPlugin({ 
            tags: ['main.css'], 
            append: true,
        }),
        // The standard plugin to do this was failing with a cryptic error message, so I had to improvise...
        new WebpackShellPluginNext({
            onBuildEnd: {
                scripts: [
                    'cp ./src/main.css ./dist/main.css',
                    'cp ./src/dot.png ./dist/dot.png',
                ],
            }
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: "module",
        },
        clean: true,
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