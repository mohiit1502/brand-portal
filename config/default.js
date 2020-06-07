const defaultListenPort = 3000;

const portFromEnv = () => {
  const x = parseInt(process.env.APP_SERVER_PORT || process.env.PORT, 10);
  return x !== null && !isNaN(x) ? x : defaultListenPort;
};
module.exports = {
  plugins: {
    "webpack-dev": {
      module: "electrode-archetype-react-app-dev/lib/webpack-dev-hapi",
      priority: -1,
      enable: process.env.WEBPACK_DEV_MIDDLEWARE === "true" && process.env.WEBPACK_DEV === "true"
    }
  },
  ui: {

  },
  electrodeStaticPaths: {
    enable: true,
    options: {
      pathPrefix: "dist"
    }
  },
  connections: {
    default: {
      host: process.env.HOST,
      address: process.env.HOST_IP || "0.0.0.0",
      port: portFromEnv(),
      routes: {
        cors: false
      },
      state: {
        ignoreErrors: true
      }
    }
  }
};
