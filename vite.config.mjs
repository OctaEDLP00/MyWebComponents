// @ts-check
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { componentCatalogPlugin } from './plugins/component-catalog.mjs'

export default defineConfig({
	base: '/MyWebComponents/',
	build: {
		outDir: 'dist-site',
	},
	plugins: [tailwindcss(), componentCatalogPlugin()]
})
