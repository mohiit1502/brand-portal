const webpack = require("webpack");

const config = {
  // module: {
  //   rules: [
  //     {
  //       test: /\.(pdf)$/,
  //       use: [
  //         {
  //           loader: "file-loader",
  //           options: {
  //             name: "[name].[ext]"
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ]
};

module.exports = config;
