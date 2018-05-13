const path = require('path');
DiscoveryPlugin = require('./webpack/discovery-plugin');

module.exports = {
    entry: './tests.ts',
    plugins: [
        new DiscoveryPlugin({
            pattern: './test/**/*.ts',
            entry: './tests.ts',
            reporter: './src/reporter'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }, 
            {
                test: /\.(html)$/,
                use: 'raw-loader'
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@tgl/core$": path.resolve(__dirname, "./../core/src/main"),
            "@tgl/gltf$": path.resolve(__dirname, "./../gltf/src/main"),
            "test$": path.resolve(__dirname, "./src/test")
        }
    },
    output: {
        filename: './dist/bundle.js',
        path: __dirname
    }
};
