const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const env = require('../env/config');

const postcssPlugins = [];

if (env.isDistRelease()) {
    postcssPlugins.push(require('autoprefixer')(env.AUTOPREFIXER_CONFIG));
}

module.exports = [
    {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
            allChunks: true,
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        minimize: env.isDistRelease()
                    }
                }
            ]
        })
    },
    {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['css-hot-loader'].concat(
            ExtractTextPlugin.extract({
                allChunks: true,
                use: [
                    {
                        loader: 'string-replace-loader',
                        query: {
                            multiple: [
                                {
                                    search: '#hostURL#',
                                    replace: env.getHostURL()
                                },
                                {
                                    search: '#hostURL2#',
                                    replace: env.getHostURL(true)
                                }
                            ]
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: env.isDistRelease()
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: postcssPlugins
                        }
                    },
                    {
                        loader: 'fast-sass-loader',
                        options: {
                            // includePaths: [path.resolve('./src/sass')]
                        }
                    }
                ]
            })
        )
    }
];
