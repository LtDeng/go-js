// const CopyWebpackPlugin = require('copy-webpack-plugin');

const path = require('path');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      node_modules: path.join(__dirname, 'node_modules'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // plugins: [new CopyWebpackPlugin([{ from: 'public/*', to: '.' }])],
};
