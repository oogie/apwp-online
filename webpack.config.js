const path = require('path')
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    mode: "production",
    entry: {
      index: './src/app_apwp/index.js',
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: 'src/app_apwp/index.html',
            chunks: ['index'],
            publicPath: "/",
            inject: false,
        })
    ],

    output: {
        filename: (pathData) => {
            if (pathData.chunk.name === 'envconfig') {
                return './[name].js'
            }
            else {
                return './[name]/[name].[contenthash].js'
            }
        },
        chunkFilename(pathData) {
            const outDir = pathData.chunk.name === 'py.worker' ? 'pyworker/' : '';
            return outDir + '[name].[contenthash].js';
        },
        publicPath: "",
        path: path.join(__dirname, "dist"),
        clean: true,
    },

    optimization: {
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
        ],
    },
    devServer: {
        devMiddleware: {
            publicPath: path.resolve(__dirname, '/')
        },
        static: {
            directory: path.join(__dirname, "/"),
            serveIndex: true
        },
        compress: true,
        allowedHosts: 'auto',
        hot: false,
        liveReload: true,
        devMiddleware: {
            writeToDisk: true
        }
    },
    watchOptions: {
        ignored: /node_modules/
    },

    module: {
        rules: [
        //JSX files
        {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        //LESS files
        {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader'],
        },
        //CSS Files
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        //Image files
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/images/',
                    publicPath: '/dist/assets/images/',
                },
            }],
        },
        //font files
        {
            test: /\.(eot|woff2|woff|ttf|svg)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/fonts/',
                    publicPath: '/dist/assets/fonts/',
                },
            }],
        },
        //Python files
        {
            test: /\.(py|whl)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/python/',
                    publicPath: '/dist/assets/python/',
                },
            }],
        },
        //json files
        {
            type: 'javascript/auto', // <= Set the module.type explicitly
            test: /\.json$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/json/',
                    publicPath: '/dist/assets/json/',
                },
            }],
        },
        //Other files
        {
            test: /\.(csv|xlsx|ods|zip|pdf)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'assets/resources/',
                    publicPath: '/dist/assets/resources/',
                },
            }],
        }],
    }
}
