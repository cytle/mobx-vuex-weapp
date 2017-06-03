const path = require('path');
const webpack = require('webpack');
const alias = require('../alias');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// var app = require('./src/app.json');

// // TODO 遍历文件夹下所有js文件
// var entry = app.pages.reduce(function (p, vo) {
//   p[vo + '.js'] = './src/' + vo + '.js';
//   return p;
// }, {});

// entry['app.js'] = './src/app.js';
const srcPath = path.resolve(__dirname, alias.src);

module.exports = {
    entry: {
        'logics/app.js': path.resolve(srcPath, 'app.js'),
        'logics/utils.js': path.resolve(srcPath, 'utils/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]',
        libraryTarget: 'commonjs2',
    },
    plugins: [],
    resolve: {
        alias,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loaders: 'babel-loader?presets[]=es2015&presets[]=stage-3',
                exclude: /node_modules/,
            },
            {
                test: /\.(png|woff2)$/,
                loader: 'url-loader?limit=0',
            },
        ],
    },
    performance: {
        hints: false,
    },
    devtool: process.env.NODE_ENV !== 'production'
        ? '#inline-source-map'
        : false,
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = module.exports.plugins.concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"',
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
        }),
    ]);
}
