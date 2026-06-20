import type { ComponentInfo } from './ComponentCatalog'

export interface CardData {
  tagName: string
  previewHTML: string
  componentInfo: ComponentInfo
  attributes: string[]
}

export class CatalogCardElement extends HTMLElement {
  #data: CardData | null = null
  #setupDone = false

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'component-catalog-card', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  set data(d: CardData) {
    this.#data = d
    this.#setupDone = false
    this.render()
  }

  get data(): CardData | null {
    return this.#data
  }

  static get styles() {
    return /* css */ `
      :host {
        display: block;
        background: var(--bg-surface, #1a1d2e);
        border: 1px solid var(--border-color, #2a2e45);
        border-radius: var(--radius, 10px);
        overflow: hidden;
        transition: all 0.25s;
        cursor: pointer;
      }
      :host(:hover) {
        border-color: var(--accent-dim, #22d3ee);
        box-shadow: 0 0 0 1px var(--accent-glow, rgba(103,232,249,0.12)), 0 4px 20px rgba(0,0,0,0.3);
        transform: translateY(-2px);
      }
      .preview {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80px;
        max-height: 160px;
        overflow: hidden;
        background: var(--bg-primary, #0b0d17);
        border-bottom: 1px solid var(--border-color, #2a2e45);
        position: relative;
      }
      .body {
        padding: 12px 16px;
      }
      .tag {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 13px;
        font-weight: 600;
        color: var(--accent, #67e8f9);
        margin-bottom: 4px;
      }
      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        align-items: center;
      }
      .badge {
        font-size: 10px;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(255,255,255,0.04);
        color: var(--text-muted, #5c6080);
        border: 1px solid var(--border-color, #2a2e45);
      }
    `
  }

  connectedCallback() {
    this.setAttribute('tabindex', '0')
    this.setAttribute('role', 'button')
    this.render()
    this.addEventListener('click', () => this.#onClick())
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        this.#onClick()
      }
    })
  }

  private render() {
    if (!this.shadowRoot) return
    const d = this.#data
    if (!d) {
      this.shadowRoot.innerHTML = ''
      this.setAttribute('aria-label', '')
      return
    }

    this.setAttribute('aria-label', `Preview ${d.tagName} component`)

    this.shadowRoot.innerHTML = /* html */ `
      <style>${CatalogCardElement.styles}</style>
      <div class="preview">${d.previewHTML}</div>
      <div class="body">
        <div class="tag">&lt;${d.tagName}&gt;</div>
        <div class="meta">
          ${d.attributes
            .filter(a => a !== 'size' && a !== 'variation')
            .slice(0, 4)
            .map(a => /* html */ `<span class="badge">${a}</span>`)
            .join('')}
          ${d.attributes.filter(a => a === 'size' || a === 'variation').length > 0
            ? /* html */ `<span class="badge">size, variation</span>`
            : ''}
        </div>
      </div>
    `

    this.#runSetup()
  }

  #runSetup() {
    if (this.#setupDone || !this.shadowRoot) return
    this.#setupDone = true

    const selects = this.shadowRoot.querySelectorAll<HTMLElement>('custom-select[data-preview]')
    selects.forEach(el => {
      ;(el as any).setOptions = [
        { value: 'react', label: 'React', icon: '⚛️' },
        { value: 'vue', label: 'Vue', icon: '💚' },
        { value: 'angular', label: 'Angular', icon: '🔴' },
      ]
    })

    const groups = this.shadowRoot.querySelectorAll<HTMLElement>('avatar-group[data-preview]')
    groups.forEach(el => {
      ;(el as any).items = [
        { src: 'https://i.pravatar.cc/80?u=1', alt: 'User 1' },
        { src: 'https://i.pravatar.cc/80?u=2', alt: 'User 2' },
        { src: 'https://i.pravatar.cc/80?u=3', alt: 'User 3' },
        { src: 'https://i.pravatar.cc/80?u=4', alt: 'User 4' },
      ]
    })
  }

  #onClick() {
    if (!this.#data) return
    this.dispatchEvent(new CustomEvent('card-click', {
      bubbles: true,
      composed: true,
      detail: { componentInfo: this.#data.componentInfo },
    }))
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.CatalogCardElement = CatalogCardElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
