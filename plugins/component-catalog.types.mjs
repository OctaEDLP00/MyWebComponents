/**
 * @typedef {'alerts' | 'badges' | 'customs' | 'dividers' | 'skeletons' | 'timelines'} CategoryName
 * @typedef {Object} ComponentEntry
 * @property {string} file - Nombre del archivo (ej: "AlertNote.ts")
 * @property {string} tagName - Nombre del tag del custom element (ej: "alert-note")
 * @property {string} className - Nombre de la clase (ej: "AlertNoteElement")
 * @property {string[]} attributes - Lista de observedAttributes
 * @property {CategoryName} category - Categoría a la que pertenece
 *
 * @typedef {Object} CategoryEntry
 * @property {CategoryName} name - Nombre interno de la categoría
 * @property {string} label - Nombre mostrable (ej: "Alerts")
 * @property {ComponentEntry[]} components - Componentes dentro de esta categoría
 */

export {}
