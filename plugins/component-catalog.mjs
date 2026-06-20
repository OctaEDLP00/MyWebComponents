/**
 * @file Plugin de Vite que escanea `src/components/` y expone un virtual module
 * con la estructura de categorías y componentes del catálogo.
 */

import { readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'

const COMPONENTS_DIR = 'src/components'

/**
 * @typedef {import('./component-catalog.types.mjs').CategoryEntry} CategoryEntry
 * @typedef {import('./component-catalog.types.mjs').ComponentEntry} ComponentEntry
 * @typedef {import('./component-catalog.types.mjs').CategoryName} CategoryName
 */

/** @returns {import('vite').Plugin} */
export function componentCatalogPlugin() {
  const virtualModuleId = 'virtual:component-catalog'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'component-catalog',
    /** @param {string} id */
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId
    },
    /** @param {string} id */
    load(id) {
      if (id !== resolvedVirtualModuleId) return

      /** @type {CategoryEntry[]} */
      const catalog = generateCatalog(resolve(COMPONENTS_DIR))
      return `export default ${JSON.stringify(catalog)}`
    },
  }
}

/**
 * Escanea el directorio de componentes y genera el catálogo.
 * @param {string} dir - Ruta absoluta a `src/components/`
 * @returns {CategoryEntry[]}
 */
function generateCatalog(dir) {
  /** @type {CategoryEntry[]} */
  const categories = []

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const categoryDir = join(dir, entry.name)
      const categoryName = /** @type {CategoryName} */ (entry.name)
      /** @type {ComponentEntry[]} */
      const components = scanComponents(categoryDir, categoryName)
      if (components.length > 0) {
        categories.push({
          name: categoryName,
          label: capitalize(entry.name),
          components,
        })
      }
    }
  }

  return categories
}

/**
 * Escanea los archivos .ts de una categoría y extrae info de cada componente.
 * @param {string} dir - Ruta absoluta a la carpeta de la categoría
 * @param {CategoryName} categoryName - Nombre de la categoría
 * @returns {ComponentEntry[]}
 */
function scanComponents(dir, categoryName) {
  const files = readdirSync(dir).filter(f => f.endsWith('.ts'))
  const raw = files.map(file => {
    const content = readFileSync(join(dir, file), 'utf-8')
    const tagName = extractTagName(content)
    const className = extractClassName(content)
    const attributes = extractAttributes(content)
    return { file, tagName, className, attributes, category: categoryName }
  })
  return /** @type {ComponentEntry[]} */ (
    raw.filter(c => c.tagName && !['component-catalog', 'component-catalog-card', 'component-catalog-modal'].includes(c.tagName))
  )
}

/**
 * Extrae el tag name del custom element desde el código fuente.
 * @param {string} content - Contenido del archivo .ts
 * @returns {string | null}
 */
function extractTagName(content) {
  // static define(tag = 'tag-name', ...) default parameter
  const defaultMatch = content.match(/static\s+define\s*\(\s*tag\s*=\s*['"`]([^'"`]+)['"`]/s)
  if (defaultMatch) return defaultMatch[1]

  // ClassName.define('tag-name') call
  const callMatch = content.match(/\.define\(\s*['"`]([^'"`]+)['"`]\s*\)/)
  if (callMatch) return callMatch[1]

  return null
}

/**
 * Extrae el nombre de la clase del componente.
 * @param {string} content
 * @returns {string | null}
 */
function extractClassName(content) {
  const m = content.match(/class\s+(\w+)\s+extends\s+HTMLElement/)
  return m ? m[1] : null
}

/**
 * Extrae los observedAttributes del componente.
 * @param {string} content
 * @returns {string[]}
 */
function extractAttributes(content) {
  const m = content.match(/static\s+get\s+observedAttributes\s*\(\s*\)\s*\{[^}]*return\s*\[([^\]]+)\]/s)
  if (!m) return []
  return m[1]
    .split(',')
    .map(a => a.trim().replace(/['"`\s]/g, ''))
    .filter(Boolean)
}

/**
 * Capitaliza la primera letra.
 * @param {string} s
 * @returns {string}
 */
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
