//const webpack = require('webpack');
//const path = require('path');

//module.exports = {
	//entry: {
		//AudioController: ['.\\src\\AudioController.js', '.\\src\\RadiusAudio.js']
	//},
	//output: {
		//path: path.resolve(__dirname, 'dist'),
		//filename: '[name].js',
		//libraryTarget: 'var',
		//library: 'AudLib',
		//libraryTarget:'var'
	//}
//};

const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'AudioLib';

let outputFile, mode;

if (env === 'build') {
  mode = 'production';
  outputFile = libraryName + '.min.js';
} else {
  mode = 'development';
  outputFile = libraryName + '.js';
}

const config = {
  mode: mode,
  entry: {AudioLib: './src/AudioLib.js'},//__dirname + '/src/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  }
};

module.exports = config;