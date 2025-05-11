import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as path from 'path';
import '@remix-run/node';

declare module '@remix-run/node' {
	interface Future {
		v3_singleFetch: true;
	}
}

export default defineConfig({
	root: __dirname,
	server: {
		port: 5173,
		strictPort: true,
		fs: {
			allow: [path.resolve(__dirname, '../../..')],
		},
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				changeOrigin: true,
				secure: false,
			},
		},
	},
	plugins: [
		remix({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
				v3_singleFetch: true,
				v3_lazyRouteDiscovery: true,
			},
		}),
		nxViteTsPaths(),
	],
});
