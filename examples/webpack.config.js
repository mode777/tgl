const path = require('path');

module.exports = {
    entry: {
        simple: './src/simple.ts',
        vertexbuffer: './src/vertex-buffer.ts'
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
    },
    output: {
        filename: './dist/[name].bundle.js',
        path: __dirname
    }
};
