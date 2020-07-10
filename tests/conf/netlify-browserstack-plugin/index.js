module.exports = {
  onSuccess: () => {
    console.log("Hello world from onSuccess event!");
    console.log(process.env.DEPLOY_URL);
  },
};
