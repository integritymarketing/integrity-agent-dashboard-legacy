module.exports = (config) => {
  if (process.env.REACT_APP_BUILD_TARGET === "auth") {
    const appDirectory = require("fs").realpathSync(process.cwd());
    config.entry = [require("path").resolve(appDirectory, "src/authIndex.js")];
    const HtmlWebpackPlugin = require("html-webpack-plugin");
    config.optimization.runtimeChunk = false;
    config.optimization.splitChunks = {
      cacheGroups: {
        default: false,
        vendors: false,
      },
    };
    config.plugins.map((plugin) => {
      if (plugin instanceof HtmlWebpackPlugin) {
        plugin.options.minify = false;
      }
    });
  }
  return config;
};
