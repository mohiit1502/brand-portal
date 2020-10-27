module.exports = {
  options: {
    criticalCSS: false,
    jest: false,
    mocha: true,
    typescript: true,
    sinon: false,
    eslint: true,
    postcss: true,
    sass: true
  },
  webpack: {
    cssModuleSupport: false,
    electrodeDevOpenBrowser: true
  },
  babel: {
    enableTypeScript: true
  }
};

