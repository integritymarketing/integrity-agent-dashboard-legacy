module.exports = {
  onSuccess: () => {
    console.log("Hello world from onPreBuild event!");
    console.log(config.build.publish);
    console.log(process.env.DEPLOY_URL);
  },
};
