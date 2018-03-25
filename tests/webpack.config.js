const path = require('path');
DiscoveryPlugin = require('./webpack/discovery-plugin');

module.exports = {
    devtool: 'source-map',
    entry: './tests.ts',
    plugins: [
        new DiscoveryPlugin({
            pattern: './test/**/*.ts',
            entry: './tests.ts'
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@tgl/core$": path.resolve(__dirname, "./../core/src/main"),
            "test$": path.resolve(__dirname, "./src/test")
        }
    },
    output: {
        filename: './dist/bundle.js',
        path: __dirname
    }
};
