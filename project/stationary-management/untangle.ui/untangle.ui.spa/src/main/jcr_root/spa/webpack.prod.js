const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const extractPlugin = new ExtractTextPlugin({
    filename: './etc/designs/cmms/clientlibs/css/app.[hash].css'
});
const extractPluginSonar = new ExtractTextPlugin({
    filename: './etc/designs/cmms/clientlibs/css/sonar.[hash].css'
});
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const GenerateAssetPlugin = require('generate-asset-webpack-plugin');
const autoprefixer = require('autoprefixer');
const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        // removing 'src' directory from entry point, since 'context' is taking care of that
        app: './index.js',
        sonar: './sonar.js'
    },
    output: {
        path: path.resolve(__dirname, 'app'),
        filename: './etc/designs/cmms/clientlibs/js/[name].[hash].bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules|helpers|test-cases/,
                enforce: 'post',
                use: [{
                    loader: 'babel-loader',
                }]
            },
            {
                test: /\.js$/,
                include: /src/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['env']
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
                            sourceMap: true,
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
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
            {
                test: /\.scss$/,
                include: [path.resolve(__dirname, 'src', 'assets', 'sonar')],
                use: extractPluginSonar.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            minimize: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer()]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
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
                        outputPath: './etc/designs/cmms/clientlibs/media/'
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
            filename: 'apps/cmms/components/page/landingpage/index.html',
            excludeAssets: [/sonar.*.js/, /sonar.*.css/], // exclude style.js or style.[chunkhash].js
        }),
        new HtmlWebpackExcludeAssetsPlugin(),
        new UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify("production")
            }
        }),

        extractPlugin,
        extractPluginSonar,
        new GenerateAssetPlugin({
            filename: 'apps/cmms/components/page/blankhtmlpage/spaassetjs.html',
            fn: (compilation, cb) => {
                cb(null, createHtml(compilation));
            }

        }),
        new GenerateAssetPlugin({
            filename: 'apps/cmms/components/page/blankhtmlpage/spaassetcss.html',
            fn: (compilation, cb) => {
                cb(null, createHtmlCss(compilation));
            }

        })

    ]
}

module.exports = config;
function createHtml(compilation) {
    var chunk = compilation.chunks[0];
    var jsFile = chunk.files[0];
    var cssFile = chunk.files[1];
    return `
        
                <script src="/${jsFile}"></script>
           
    `;
};
function createHtmlCss(compilation) {
    var chunk = compilation.chunks[0];
    var jsFile = chunk.files[0];
    var cssFile = chunk.files[1];
    return `
        
                <link rel="stylesheet" href="/${cssFile}">
           
    `;
};