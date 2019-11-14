const path = require('path');
const webpack = require('webpack');
require('dotenv').config();

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // installed via npm

module.exports = ( env, argv ) => {

    const isDevelopment = ( argv.mode === "development" );

    const minimizerPlugins = isDevelopment ? [] : [
        new OptimizeCSSAssetsPlugin({}),
        new TerserPlugin()
    ];

    return ({
        entry: [
            './src/js/main.js',
            './src/scss/style.scss',
        ],
        output: {
            path: path.resolve(__dirname, 'dist'),
        },
        optimization: {
            minimize: !isDevelopment,
            minimizer: minimizerPlugins,
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {minimize: !isDevelopment}
                        }
                    ]
                },
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'src/js'),
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                // you can specify a publicPath here
                                // by default it uses publicPath in webpackOptions.output
                                // publicPath: '../',
                                hmr: process.env.NODE_ENV === 'development',
                            },
                        },
                        'css-loader', 'sass-loader'],
                },
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['css/*', '*.*'],
            }),
            new MiniCssExtractPlugin({
                filename: './css/[name].css',
            }),
            new CopyWebpackPlugin([
                {
                    from: './src/html',
                    to: './'
                },
                {
                    from: './src/*.json',
                    to: './[name].[ext]'
                },
            ]),
            new webpack.DefinePlugin({
                _APP_ID_: JSON.stringify(process.env.APP_ID),
                _APP_HASH_: JSON.stringify(process.env.APP_HASH),
                _APP_TEST_SERVER_: process.env.APP_TEST_SERVER,
                _APP_PROD_SERVER_: process.env.APP_PROD_SERVER,
                _APP_VERSION_: JSON.stringify(require('./package.json').version),
                _DEBUG_: JSON.stringify(isDevelopment),
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            port: 9000,
            compress: true,
            hot: true,
        }
    });
};
