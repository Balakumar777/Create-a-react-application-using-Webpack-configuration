import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WebPackConfig = {
    mode:"development",
    entry: ["regenerator-runtime/runtime.js", './src/index.js'],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    }, 
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader","css-loader","sass-loader",],
            },
        ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        port: 3000,
        historyApiFallback: true,
    },
};

export default WebPackConfig;