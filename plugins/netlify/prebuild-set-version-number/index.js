const { version } = require("../../../package.json");

module.exports = {
  onPreBuild: () => {
    process.env["VITE_VERSION"] = version;
    console.log(`Setting VITE_VERSION to ${import.meta.env.VITE_VERSION}`);
  },
};
