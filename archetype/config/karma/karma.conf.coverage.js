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
      files: [
        "test/client/components/**/*.spec.js",
        // "src/client/components/**/*.test.js"
      ],
    })
  );
};
