const { version } = require("../../../package.json");

module.exports = {
  onPreBuild: () => {
    process.env["REACT_APP_VERSION"] = version;
  },
};
