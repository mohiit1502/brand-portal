module.exports = {
  cache: {
    cacheId: "RoPro",
    runtimeCaching: [
      {
        handler: "fastest",
        urlPattern: "/$"
      }
    ],
    staticFileGlobs: ["dist/**/*"]
  },
  manifest: {
    background: "#FFFFFF",
    title: "RoPro",
    short_name: "PWA",
    theme_color: "#FFFFFF"
  }
};
