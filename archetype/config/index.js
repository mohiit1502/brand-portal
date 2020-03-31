module.exports = {
  options: {
    criticalCSS: true,
    jest: false,
    mocha: true,
    typescript: true,
    sinon: false,
    eslint: true,
    postcss: true,
    sass: true
  },
  webpack: {
    cssModuleSupport: true,
    electrodeDevOpenBrowser: true
  },
  babel: {
    enableTypeScript: true
  }
};
