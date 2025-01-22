const { version } = require("../../../package.json");

module.exports = {
  onPreBuild: () => {
    process.env["REACT_APP_VERSION"] = version;
    console.log(
      `Setting REACT_APP_VERSION to ${import.meta.env.VITE_VERSION}`
    );
  },
};
