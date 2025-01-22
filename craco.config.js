const fs = require("fs");
const evalSourceMap = require("react-dev-utils/evalSourceMapMiddleware");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");
const noopServiceWorker = require("react-dev-utils/noopServiceWorkerMiddleware");

module.exports = {
    eslint: {
        enable: false,
    },
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            if (import.meta.env.VITE_BUILD_TARGET === "auth") {
                const appDirectory = require("fs").realpathSync(process.cwd());
                webpackConfig.entry = [require("path").resolve(appDirectory, "src/authIndex.js")];
            }
            return webpackConfig;
        },
    },
    devServer: (devServerConfig, { env, paths }) => {
        devServerConfig = {
            ...devServerConfig,
            client: {
                ...devServerConfig.client,
                overlay: false,
            },
            onBeforeSetupMiddleware: undefined,
            onAfterSetupMiddleware: undefined,
            setupMiddlewares: (middlewares, devServer) => {
                if (!devServer) {
                    throw new Error("webpack-dev-server is not defined");
                }
                if (fs.existsSync(paths.proxySetup)) {
                    require(paths.proxySetup)(devServer.app);
                }
                middlewares.push(
                    evalSourceMap(devServer),
                    redirectServedPath(paths.publicUrlOrPath),
                    noopServiceWorker(paths.publicUrlOrPath)
                );
                return middlewares;
            },
        };
        return devServerConfig;
    },
};
