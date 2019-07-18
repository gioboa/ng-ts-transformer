var transformer = require('./transformer').default;

module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          getCustomTransformers: program => ({
            before: [transformer]
          })
        }
      }
    ]
  }
};
