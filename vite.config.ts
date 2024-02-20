import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import windiCSS from 'vite-plugin-windicss'
import tsConfigPath from 'vite-tsconfig-paths'

export default defineConfig(
    env => ({
        plugins: [
            // only use react-fresh
            env.mode === 'development' && react(),
            tsConfigPath(),
            windiCSS(),
            VitePWA({
                injectRegister: 'inline',
                manifest: {
                    icons: [{
                        src: 'https://github.com/MetaCubeX.png?size=512',
                        sizes: '512x512',
                        type: 'image/png',
                    }],
                    start_url: '/',
                    short_name: 'MetacubeX Dashboard',
                    name: 'MetacubeX Dashboard',
                },
                workbox: {
                    inlineWorkboxRuntime: true,
                },
            }),
        ],
        base: './',
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "sass:math"; @import "src/styles/variables.scss";',
                },
            },
        },
        build: {
            reportCompressedSize: false,
            cssCodeSplit: false,
            rollupOptions: {
                output: {
                    inlineDynamicImports: true,
                    entryFileNames: '[name].js',
                    assetFileNames: '[name].[ext]',
                    manualChunks: undefined,
                }
            }
        },
        esbuild: {
            jsxInject: "import React from 'react'",
        },
    }),
)
