const path = require("path");

module.exports = {
    devtool: 'source-map',
    entry: './src/index.ts',
    plugins: [],
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
            "@tgl/core$": path.resolve(__dirname, "./../core/src/main")
        }
    },
    output: {
        filename: './dist/bundle.js',
        path: __dirname
    }
};
