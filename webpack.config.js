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
        entry: {
            main: './src/js/main.js',
            login: ['./src/js/login.js', './src/scss/login.scss'],
            app: ['./src/js/app.js', './src/scss/style.scss'],
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist'),
        },
        optimization: {
            minimize: !isDevelopment,
            minimizer: minimizerPlugins,
        },
        devtool: isDevelopment ? "source-map" : false,
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                minimize: !isDevelopment
                            }
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
                                name: 'css/[name].css',
                                hmr: isDevelopment,
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
                {
                    from: './src/*.json',
                    to: './[name].[ext]'
                },
            ]),
            new webpack.DefinePlugin({
                _APP_ID_: JSON.stringify(process.env.APP_ID),
                _APP_HASH_: JSON.stringify(process.env.APP_HASH),
                _APP_TEST_SERVER_: JSON.stringify(process.env.APP_TEST_SERVER),
                _APP_PROD_SERVER_: JSON.stringify(process.env.APP_PROD_SERVER),
                _APP_VERSION_: JSON.stringify(require('./package.json').version),
                _DEBUG_: JSON.stringify(isDevelopment),
            })
        ],
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            port: 3000,
            compress: true,
            hot: true,
        }
    });
};
