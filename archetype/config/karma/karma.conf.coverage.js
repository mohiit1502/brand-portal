module.exports = function (config, settings) {
  config.set(
    Object.assign({}, settings, {
      browsers: ["ChromeHeadlessNoSandbox"],
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: "ChromeHeadless",
          flags: ["--no-sandbox"]
        }
      },
      webpack: { //kind of a copy of your webpack config
        devtool: 'inline-source-map', //just do inline source maps instead of the default
        module: {
          loaders: [
            { test: /\.(pdf)$/, loader: 'file-loader' }
          ]
        }
      },
      webpackServer: {
        noInfo: true //please don't spam the console when running in karma!
      }
    })
  );
};
