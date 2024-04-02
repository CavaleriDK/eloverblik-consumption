const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const commonConfig = {
    mode: 'production',
    entry: './src/_browser/index.ts', // Your entry point
    output: {
        path: path.resolve(__dirname, 'dist/browser'),
        library: 'ElOverblik Consumption', // Exported library name
        libraryTarget: 'umd', // Universal Module Definition
        umdNamedDefine: true,
    },
    resolve: {
        extensions: ['.ts', '.js'], // Resolve TypeScript and JavaScript files
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader',
                },
            },
        ],
    },
};

// Minified version configuration
const minifiedConfig = {
    ...commonConfig,
    output: {
        ...commonConfig.output,
        filename: 'eloverblik-consumption.min.js', // Output file name
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    ecma: 6,
                    compress: true,
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
};

// Non-minified version configuration
const nonMinifiedConfig = {
    ...commonConfig,
    output: {
        ...commonConfig.output,
        filename: 'eloverblik-consumption.js',
    },
    optimization: {
        minimize: false,
    },
};

module.exports = [minifiedConfig, nonMinifiedConfig];