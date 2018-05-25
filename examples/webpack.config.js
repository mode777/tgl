const path = require('path');

module.exports = {
    entry: {
        simple: './src/simple.ts',
        vertexbuffer: './src/vertex-buffer.ts',
        'framebuffer-tutorial': './src/framebuffer-tutorial.ts',
        sprite: './src/sprite.ts'
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
            "@tgl/gltf$": path.resolve(__dirname, "./../gltf/src/main"),
            "@tgl/2d$": path.resolve(__dirname, "./../2d/src/main"),
        }
    },
    output: {
        filename: './dist/[name].bundle.js',
        path: __dirname
    }
};
