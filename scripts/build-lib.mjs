#!/usr/bin/env node
// @ts-check
import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'dist/lib')

// Step 1 — build JS bundles
execSync('vite build --config vite.lib.config.mjs', { cwd: root, stdio: 'inherit' })

// Step 2 — generate package.json for the lib output directory
const rootPkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'))

// Discover all generated .js files to build exports map
function discoverOutputs(dir, prefix = '') {
  const entries = []
  const items = readdirSync(dir, { withFileTypes: true })
  for (const item of items) {
    if (item.isDirectory() && item.name !== 'shared') {
      entries.push(...discoverOutputs(join(dir, item.name), `${prefix}${item.name}/`))
    } else if (item.isFile() && item.name.endsWith('.js') && !item.name.startsWith('_')) {
      const name = item.name.replace('.js', '')
      entries.push({ name, path: `./${prefix}${item.name}` })
    }
  }
  return entries
}

const entries = discoverOutputs(outDir)
const exportsMap = {}
for (const { name, path } of entries) {
  exportsMap[`./${name}`] = path
}
exportsMap['./package.json'] = './package.json'

const libPkg = {
  name: '@wc/components',
  type: 'module',
  version: rootPkg.version || '0.0.0',
  private: false,
  description: 'Web Components library',
  main: entries.find(e => e.name === 'index')?.path || entries[0]?.path || '',
  exports: exportsMap,
  files: ['.'],
  dependencies: {
    'highlight.js': rootPkg.dependencies?.['highlight.js'] || '*',
  },
}

writeFileSync(join(outDir, 'package.json'), JSON.stringify(libPkg, null, 2) + '\n')
console.log(`\n✓ Library built at ${outDir}`)
console.log(`  Package: ${libPkg.name}@${libPkg.version}`)
console.log(`  Entries: ${entries.length}`)
