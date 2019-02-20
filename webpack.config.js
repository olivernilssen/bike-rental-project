const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};

module.exports = {
    module: {
      loaders: [
        { test: /\.css$/, loader: "style-loader!css-loader" },
        // ...
      ]
    }
  };