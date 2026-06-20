import type { ComponentInfo } from './ComponentCatalog'

export class CatalogModalElement extends HTMLElement {
  componentInfo: ComponentInfo | null = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'component-catalog-modal', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get styles() {
    return /* css */ `
      :host {
        --bg-primary: #0b0d17;
        --bg-secondary: #12141e;
        --bg-surface: #1a1d2e;
        --border-color: #2a2e45;
        --text-primary: #e8e9f0;
        --text-secondary: #9498b0;
        --accent: #67e8f9;
        --accent-glow: rgba(103, 232, 249, 0.12);
        --radius: 10px;

        position: fixed;
        inset: 0;
        z-index: 1000;
        display: none;
        align-items: center;
        justify-content: center;
        font-family: 'DM Sans', system-ui, sans-serif;
        color-scheme: dark;
      }
      :host([open]) {
        display: flex;
      }
      .backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(4px);
      }
      .panel {
        position: relative;
        width: min(90vw, 800px);
        max-height: 85vh;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: var(--radius);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: 0 24px 80px rgba(0,0,0,0.6);
      }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);
        background: var(--bg-secondary);
      }
      .title {
        font-size: 16px;
        font-weight: 600;
        color: var(--accent);
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        margin: 0;
      }
      .close-btn {
        background: none;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.15s;
      }
      .close-btn:hover {
        background: var(--bg-hover, #232740);
        color: var(--text-primary);
      }
      .body {
        flex: 1;
        overflow: auto;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
      }
      .body > ::slotted(*) {
        max-width: 100%;
      }
      .meta {
        padding: 12px 20px;
        border-top: 1px solid var(--border-color);
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        background: var(--bg-secondary);
      }
      .badge {
        font-size: 11px;
        font-weight: 500;
        padding: 3px 10px;
        border-radius: 4px;
        background: rgba(255,255,255,0.04);
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
      }
      .badge.accent {
        color: var(--accent);
        border-color: var(--accent);
        background: var(--accent-glow);
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--text-muted, #5c6080);
      }
    `
  }

  connectedCallback() {
    this.setAttribute('role', 'dialog')
    this.setAttribute('aria-modal', 'true')
    this.setAttribute('aria-labelledby', 'modal-title')
    this.render()
    this.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close()
    })
  }

  show(info: ComponentInfo, contentHTML: string) {
    this.componentInfo = info
    this.renderContent(contentHTML)
    this.setAttribute('open', '')
    document.body.style.overflow = 'hidden'
    this.focus()
    this.setupFocusTrap()
  }

  close() {
    this.removeAttribute('open')
    document.body.style.overflow = ''
    this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }))
  }

  private render() {
    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${CatalogModalElement.styles}</style>
      <div class="backdrop" part="backdrop"></div>
      <div class="panel" part="panel">
        <div class="header">
          <h2 class="title" id="modal-title"></h2>
          <button class="close-btn" part="close-btn" aria-label="Close">&times;</button>
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
        <div class="meta" id="meta"></div>
      </div>
    `)

    this.shadowRoot?.querySelector('.backdrop')?.addEventListener('click', () => this.close())
    this.shadowRoot?.querySelector('.close-btn')?.addEventListener('click', () => this.close())
  }

  private renderContent(html: string) {
    const titleEl = this.shadowRoot?.querySelector('#modal-title')
    const body = this.shadowRoot?.querySelector('.body')
    const meta = this.shadowRoot?.querySelector('#meta')
    const info = this.componentInfo

    if (!info || !titleEl || !body || !meta) return

    titleEl.textContent = `<${info.tagName}>`

    body.innerHTML = html

    const badges = info.attributes
      .filter(a => a !== 'size' && a !== 'variation')
      .slice(0, 6)
      .map(a => /* html */ `<span class="badge">${a}</span>`)
      .join('')

    const extra = info.attributes.filter(a => a === 'size' || a === 'variation').length > 0
      ? /* html */ `<span class="badge accent">size, variation</span>`
      : ''

    meta.innerHTML = badges + extra

    const closeBtn = this.shadowRoot?.querySelector('.close-btn') as HTMLElement | null
    closeBtn?.focus()
  }

  private setupFocusTrap() {
    const panel = this.shadowRoot?.querySelector('.panel') as HTMLElement | null
    if (!panel) return
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    this.addEventListener('keydown', trap)
    this.addEventListener(
      'modal-close',
      () => this.removeEventListener('keydown', trap),
      { once: true }
    )
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.CatalogModalElement = CatalogModalElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
