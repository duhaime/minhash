import webpack from 'webpack'
import path from 'path'

const paths = {
    src: path.resolve(__dirname),
    build: path.resolve(__dirname)
}

const uglifyConfig = {
    sourceMap: false,
    warnings: false,
    mangle: true,
    minimize: true
}

module.exports = {
    mode: 'production',
    entry: path.resolve(paths.src, 'index.js'),
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
        path: paths.build,
        filename: 'minhash.min.js',
    },
    module: {
        rules: []
    }
};
