const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const webpack = require('webpack');
require('dotenv').config();

let devServer = {
    static: {
        directory: path.join(__dirname, './clientRoot/Static'),
    },
    port: 8040,
    historyApiFallback: true,
    open: false,
    host: process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0',
    hot: process.env.NODE_ENV === 'development',
    liveReload: process.env.NODE_ENV === 'development',
};

if (process.env.NODE_ENV === 'development') {
    devServer.server = {
        type: 'https',
        options: {
            key: fs.readFileSync(path.join(__dirname, './SecurityCertificate/localhost-key.pem')),
            cert: fs.readFileSync(path.join(__dirname, './SecurityCertificate/localhost.pem')),
        }
    };
}

module.exports = {
    entry: './clientRoot/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(mp3|wav|ogg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            favicon: './standardIcon.ico',
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_SERVER_ADDRESS': JSON.stringify(process.env.NODE_ENV === 'development' ? 'https://localhost:3030' : 'https://my_url.com')
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: 'process/browser',
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            "zlib": require.resolve("browserify-zlib"),
            "querystring": require.resolve("querystring-es3"),
            "path": require.resolve("path-browserify"),
            "crypto": require.resolve("crypto-browserify"),
            "http": require.resolve("stream-http"),
            "stream": require.resolve("stream-browserify"),
            "fs": false, // or you can use an empty module
            "net": false,
            "tls": false,
            "async_hooks": false,
            "buffer": require.resolve("buffer/"),
            "vm": require.resolve("vm-browserify"),
            "assert": require.resolve("assert/"),
            "util": require.resolve("util/"),
            "url": require.resolve("url/"),
            "process": require.resolve("process/browser"),
            
        },
        alias: {
            Contexts: path.resolve(__dirname, 'clientRoot/Static/'),
            ServerCalls: path.resolve(__dirname, 'clientRoot/Static/ServerCalls/'),
            GlobalComponents: path.resolve(__dirname, 'clientRoot/Static/GlobalComponents/'),
        },
    },
    devServer: devServer,
    ignoreWarnings: [
        {
            module: /express/, // Suppresses warnings related to `express`
            message: /Critical dependency: the request of a dependency is an expression/,
        },
    ],
    stats: {
        errorDetails: true,
    },
};