const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const extractPlugin = new ExtractTextPlugin({
    filename: './etc/designs/cmms/clientlibs/css/app.[hash].css'
});
// const StyleLintPlugin = require('stylelint-webpack-plugin');
const autoprefixer = require('autoprefixer');
const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        // removing 'src' directory from entry point, since 'context' is taking care of that
        app: './index.js'
    },
    output: {
        path: path.resolve(__dirname, 'app'),
        filename: './etc/designs/cmms/clientlibs/js/[name].[hash].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules|vendor/,
                loader: "eslint-loader",
                options: {
                    cache: false,
                    emitError: true,
                    quiet: true,
                    failOnError: true
                    // outputReport: {
                    //     filePath: 'es-lint-[hash].html',
                    //     formatter: require('eslint/lib/formatters/html')
                    // }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules|helpers|test-cases/,
                enforce: 'post',
                use: [{
                    loader: 'babel-loader',
                }, {
                    loader: 'istanbul-instrumenter-loader',
                    options: { esModules: true }
                }]
            },
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env'],
                        sourceMap: true
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [{
                    loader: 'handlebars-loader',
                    options: {
                        helperDirs: path.resolve(__dirname, "./scripts/helpers")
                    }
                }]
            },
            //html-loader
            {
                test: /\.html$/,
                use: ['html-loader']
            },

            {
                test: /\.scss$/,
                include: [path.resolve(__dirname, 'src', 'assets', 'scss')],
                use: extractPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            importer: function (url, prev) {
                                if (url.indexOf('@material') === 0) {
                                    const filePath = url.split('@material')[1];
                                    const nodeModulePath = `./node_modules/@material/${filePath}`;
                                    return {
                                        file: require('path').resolve(nodeModulePath)
                                    };
                                }
                                return {
                                    file: url
                                };
                            }

                        }
                    }
                    ],
                    fallback: 'style-loader'
                })
            },
            // file-loader(for images)
            {
                test: /\.(jpg|png|gif|svg|ico)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './etc/designs/cmms/clientlibs/media/',
                    }
                }]
            },
            // file-loader(for fonts)
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: './etc/designs/cmms/clientlibs/fonts/'
                    }
                }]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['app']),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CopyWebpackPlugin([
            { from: './scripts/vendor/decoder.min.js', to: 'etc/designs/cmms/clientlibs/js' },
            { from: 'assets/media', to: 'etc/designs/cmms/clientlibs/media' }
        ]),
        //html-webpack-plugin instantiation
        new HtmlWebpackPlugin({
            hash: true,
            template: './index.hbs',
            filename: 'apps/cmms/components/page/landingpage/index.html'
        }),
        extractPlugin
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "app"),
        compress: true,
        port: 12001,
        stats: 'errors-only',
        open: true
    },
    devtool: 'inline-source-map'
}

module.exports = config;