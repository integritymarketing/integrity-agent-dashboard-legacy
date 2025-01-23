import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
    const isAuthBuild = process.env.VITE_APP_BUILD_TARGET === "auth";

    return {
        base: "/", // (Default) Root-level path
        // Plugins
        plugins: [react()],

        // Build configuration
        build: {
            outDir: isAuthBuild ? "distAuth" : "dist", // Separate output folders
            rollupOptions: {
                input: isAuthBuild
                    ? path.resolve(__dirname, "src/authIndex.js") // Custom entry point for auth build
                    : path.resolve(__dirname, "src/index.js"),    // Main entry point
            },
        },

        // Dev server configuration
        server: {
            port: isAuthBuild ? 3001 : 3000, // Separate dev servers if needed
            open: true,
            proxy: {
                "/api": {
                    target: "https://api.example.com", // Adjust as per your API
                    changeOrigin: true,
                    secure: false,
                },
            },
        },

        // Resolve aliases for src path
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
                providers: path.resolve(__dirname, "src/providers"), // Alias for 'providers' directory
                routeConfigs: path.resolve(__dirname, "src/routeConfigs"), // Alias for 'routeConfigs' directory
                components: path.resolve(__dirname, "src/components"), // Alias for 'components'
                hooks: path.resolve(__dirname, "src/hooks"), // Alias for 'hooks'
                contexts: path.resolve(__dirname, "src/contexts"), // Alias for 'contexts'
                pages: path.resolve(__dirname, "src/pages"), // Alias for 'pages'
                styles: path.resolve(__dirname, "src/styles"), // Alias for 'styles'
                services: path.resolve(__dirname, "src/services"), // Alias for 'services'
                auth: path.resolve(__dirname, "src/auth"), // Alias for 'auth'
                mobile: path.resolve(__dirname, "src/mobile"), // Alias for 'mobile'
                utils: path.resolve(__dirname, "src/utils"), // Alias for 'utils'
                partials: path.resolve(__dirname, "src/partials"), // Alias for 'partials'
                utilities: path.resolve(__dirname, "src/utilities"), // Alias for 'partials'
                packages: path.resolve(__dirname, "src/packages"), // Alias for 'packages'
                images: path.resolve(__dirname, "src/images"), // Alias for 'images'
                scss: path.resolve(__dirname, "src/scss"), // Alias for 'scss'
            },
            extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },

        optimizeDeps: {
            exclude: ["recoil", "moment", "react-table"], // Exclude Recoil from dependency pre-bundling
        },
    };
});