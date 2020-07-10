module.exports = {
  onSuccess: async ({
    constants,
    utils: { build, status, cache, run, git },
  }) => {
    console.log(constants.PUBLISH_DIR);
    console.log(process.env.DEPLOY_URL);
    await run.command("yarn e2e:browserstack");
  },
};
