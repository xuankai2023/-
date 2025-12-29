import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import preserveDirectives from 'rollup-preserve-directives';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
    let aliases: Record<string, string> = {};
    if (fs.existsSync(path.resolve(__dirname, '../../packages'))) {
        const packages = fs.readdirSync(
            path.resolve(__dirname, '../../packages')
        );
        aliases = {
            'data-generator-retail': path.resolve(
                __dirname,
                '../data-generator/src'
            ),
        };
        for (const dirName of packages) {
            if (dirName === 'create-react-admin') continue;
            const packageJson = JSON.parse(
                fs.readFileSync(
                    path.resolve(
                        __dirname,
                        '../../packages',
                        dirName,
                        'package.json'
                    ),
                    'utf8'
                )
            );
            aliases[packageJson.name] = path.resolve(
                __dirname,
                `../../packages/${packageJson.name}/src`
            );
        }
    }

    return {
        plugins: [
            react(),
            visualizer({
                open: process.env.NODE_ENV !== 'CI',
                filename: './dist/stats.html',
            }),
        ],
        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.REACT_APP_DATA_PROVIDER': JSON.stringify(
                process.env.REACT_APP_DATA_PROVIDER
            ),
        },
        server: {
            port: 8080,
            open: true,
            proxy: {
                '/api': {
                    target: 'http://localhost:8083',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, '/api'),
                    // 配置代理错误处理（使用 http-proxy-middleware 的 configure 选项）
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.warn('⚠️  代理错误:', err.message);
                            console.warn('💡 提示: 请确保后端服务器运行在 http://localhost:8083');
                        });
                        proxy.on('proxyReq', (proxyReq, req, _res) => {
                            if (process.env.NODE_ENV === 'development') {
                                console.log(`[代理] ${req.method} ${req.url} -> http://localhost:8083${req.url}`);
                            }
                        });
                    },
                    // 如果需要 WebSocket 支持，取消注释
                    // ws: true,
                }
            }
        },
        base: './',
        esbuild: {
            keepNames: true,
        },
        build: {
            sourcemap: true,
            rollupOptions: {
                plugins: [preserveDirectives()],
            },
        },
        resolve: {
            preserveSymlinks: true,
            alias: [
                // FIXME: doesn't work with react 19
                // allow profiling in production
                // { find: /^react-dom$/, replacement: 'react-dom/profiling' },
                // {
                //     find: 'scheduler/tracing',
                //     replacement: 'scheduler/tracing-profiling',
                // },
                // The 2 next aliases are needed to avoid having multiple react-router instances
                {
                    find: 'react-router-dom',
                    replacement: path.resolve(
                        __dirname,
                        `node_modules/react-router/dist/${mode === 'production' ? 'production' : 'development'}/index.mjs`
                    ),
                },
                {
                    find: 'react-router',
                    replacement: path.resolve(
                        __dirname,
                        `node_modules/react-router/dist/${mode === 'production' ? 'production' : 'development'}/index.mjs`
                    ),
                },
                // The 2 next aliases are needed to avoid having multiple MUI instances
                {
                    find: /^@mui\/([a-zA-Z0-9-_]+)\/*(.*)$/,
                    replacement: `${path.resolve(
                        __dirname,
                        'node_modules/@mui/$1/esm/$2'
                    )}`,
                },
                // we need to manually follow the symlinks for local packages to allow deep HMR
                ...Object.keys(aliases).map(packageName => ({
                    find: packageName,
                    replacement: aliases[packageName],
                })),
            ],
        },
    };
});
