const path = require('path');

module.exports = {
    entry: {
        simple: './src/simple.ts',
        vertexbuffer: './src/vertex-buffer.ts',
        'framebuffer-tutorial': './src/framebuffer-tutorial.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@tgl/core$": path.resolve(__dirname, "./../core/src/main"),
        }
    },
    output: {
        filename: './dist/[name].bundle.js',
        path: __dirname
    }
};
