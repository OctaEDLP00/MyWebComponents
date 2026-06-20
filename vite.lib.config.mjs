// @ts-check
import { defineConfig } from 'vite'
import { readdirSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = join(__dirname, 'src/components')
const outDir = join(__dirname, 'dist/lib')

const EXCLUDE = new Set(['global.d.ts', 'index.ts'])
const EXCLUDE_NAMES = new Set(['component-catalog', 'catalog-card', 'catalog-modal'])

/**
 * Recursively discover PascalCase .ts files and convert to kebab-case entry names.
 * @param {string} dir
 * @returns {Record<string, string>}
 */
function discoverComponents(dir) {
  /** @type {Record<string, string>} */
  const entries = {}
  const items = readdirSync(dir)
  for (const item of items) {
    if (EXCLUDE.has(item)) continue
    const fullPath = join(dir, item)
    if (statSync(fullPath).isDirectory()) {
      Object.assign(entries, discoverComponents(fullPath))
    } else if (item.endsWith('.ts') && item[0] === item[0].toUpperCase()) {
      const name = item.replace('.ts', '')
      const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      entries[kebab] = fullPath
    }
  }
  return entries
}

const entries = discoverComponents(srcDir)
for (const name of EXCLUDE_NAMES) {
  delete entries[name]
}

export default defineConfig({
  build: {
    lib: {
      entry: entries,
      formats: ['es'],
    },
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      external: ['highlight.js'],
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'shared/[name]-[hash].js',
        globals: { 'highlight.js': 'hljs' },
      },
    },
  },
})
