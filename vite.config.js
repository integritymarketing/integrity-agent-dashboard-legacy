import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
  return {
    base: '/',
    plugins: [
      react(),
      federation({
        name: 'integrityAgentDashboard',
        filename: 'integrityAgentDashboard.js',
        exposes: {
          './AgentDashboard': './src/MFEComponent.jsx',
        },
        remotes: {
          // hostContext: 'http://localhost:3000/assets/remoteEntry.js',
        },
        shared: [{
          'react': {
            requiredVersion: '18.3.1',
          },
          'react-dom': {
            requiredVersion: '18.3.1',
          },
          'react-router-dom': {
            requiredVersion: '6.21.1',
          },
          '@auth0/auth0-react': {
            requiredVersion: '2.2.4',
          },
          'react-helmet-async': {
            requiredVersion: '2.0.4',
          },
          'react-media': {
            requiredVersion: '1.10.0',
          },
          '@mui/icons-material': {
            requiredVersion: '5.14.1'
          },
          '@mui/material': {
            requiredVersion: '5.14.2'
          },
          '@mui/styles': {
            requiredVersion: '5.14.3'
          },
        }]
      }),
    ],
    publicDir: 'public',

    build: {
      modulePreload: false, // Add this line
      outDir: 'build',
      sourcemap: true,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          format: 'esm',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
        },
      },
    },

    server: {
      port: 3001,
      open: true,
      historyApiFallback: true,
    },

    preview: {
      port: 3001,
      open: true,
      historyApiFallback: true,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        src: path.resolve(__dirname, 'src'),
        providers: path.resolve(__dirname, 'src/providers'),
        routeConfigs: path.resolve(__dirname, 'src/routeConfigs'),
        components: path.resolve(__dirname, 'src/components'),
        hooks: path.resolve(__dirname, 'src/hooks'),
        contexts: path.resolve(__dirname, 'src/contexts'),
        pages: path.resolve(__dirname, 'src/pages'),
        styles: path.resolve(__dirname, 'src/styles'),
        services: path.resolve(__dirname, 'src/services'),
        auth: path.resolve(__dirname, 'src/auth'),
        mobile: path.resolve(__dirname, 'src/mobile'),
        utils: path.resolve(__dirname, 'src/utils'),
        partials: path.resolve(__dirname, 'src/partials'),
        utilities: path.resolve(__dirname, 'src/utilities'),
        packages: path.resolve(__dirname, 'src/packages'),
        images: path.resolve(__dirname, 'src/images'),
        scss: path.resolve(__dirname, 'src/scss'),
        schemas: path.resolve(__dirname, 'src/schemas'),
        ValidationSchemas: path.resolve(__dirname, 'src/ValidationSchemas'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },

    css: {
      preprocessorOptions: {
        scss: {
          sassOptions: {
            quietDeps: true,
          },
        },
      },
    },

    optimizeDeps: {
      exclude: ['moment'],
    },
  };
});
