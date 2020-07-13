module.exports = {
  onSuccess: async ({
    constants,
    utils: { build, status, cache, run, git },
  }) => {
    await run.command("yarn e2e:browserstack");
  },
};
