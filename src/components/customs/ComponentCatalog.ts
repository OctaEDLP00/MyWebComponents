import catalogData from 'virtual:component-catalog'
import type { CardData } from './CatalogCard'

export interface ComponentInfo {
  file: string
  tagName: string
  className: string
  attributes: string[]
  category: string
}

export interface CategoryInfo {
  name: string
  label: string
  components: ComponentInfo[]
}

type CatalogNavItem = CategoryInfo | { name: 'all'; label: 'All Components'; components: ComponentInfo[] }

export class ComponentCatalogElement extends HTMLElement {
  private selectedIndex = 0
  private catalog: CategoryInfo[] = []
  private navItems: CatalogNavItem[] = []
  private allComponents: ComponentInfo[] = []
  private searchQuery = ''
  private main: HTMLElement | null = null
  private searchInput: HTMLInputElement | null = null
  private dropdown: HTMLElement | null = null
  private activeSuggestion = -1
  private modal: HTMLElement | null = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'component-catalog', registry = customElements) {
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
        --bg-hover: #232740;
        --border-color: #2a2e45;
        --text-primary: #e8e9f0;
        --text-secondary: #9498b0;
        --text-muted: #5c6080;
        --accent: #67e8f9;
        --accent-dim: #22d3ee;
        --accent-glow: rgba(103, 232, 249, 0.12);
        --radius: 10px;
        --radius-sm: 6px;
        display: block;
        font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        color-scheme: dark;
      }

      .catalog {
        display: flex;
        height: 100%;
        min-height: 70vh;
        background: var(--bg-primary);
        border-radius: var(--radius);
        overflow: hidden;
        border: 1px solid var(--border-color);
      }

      .sidebar {
        width: 220px;
        flex-shrink: 0;
        background: var(--bg-secondary);
        border-right: 1px solid var(--border-color);
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      .sidebar-header {
        padding: 20px 16px 12px;
        border-bottom: 1px solid var(--border-color);
        position: relative;
      }

      .sidebar-title {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--text-muted);
        margin: 0 0 12px;
      }

      search {
        display: block;
        position: relative;
      }

      .search-input {
        width: 100%;
        padding: 8px 12px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
        box-sizing: border-box;
        transition: border-color 0.2s;
      }

      .search-input:focus {
        border-color: var(--accent-dim);
      }

      .search-input::placeholder {
        color: var(--text-muted);
      }

      .predictions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 4px;
        background: var(--bg-surface);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        max-height: 240px;
        overflow-y: auto;
        z-index: 20;
        display: none;
        box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      }

      .predictions.visible {
        display: block;
      }

      .prediction-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        cursor: pointer;
        transition: background 0.15s;
        border-bottom: 1px solid var(--border-color);
      }

      .prediction-item:last-child {
        border-bottom: none;
      }

      .prediction-item:hover,
      .prediction-item.highlighted {
        background: var(--bg-hover);
      }

      .prediction-tag {
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        font-size: 12px;
        color: var(--accent);
        font-weight: 500;
      }

      .prediction-cat {
        font-size: 11px;
        color: var(--text-muted);
        margin-left: auto;
      }

      .nav {
        list-style: none;
        margin: 0;
        padding: 8px 0;
        flex: 1;
        overflow-y: auto;
      }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        cursor: pointer;
        color: var(--text-secondary);
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        border-left: 2px solid transparent;
      }

      .nav-item:hover {
        background: var(--bg-hover);
        color: var(--text-primary);
      }

      .nav-item.active {
        background: var(--accent-glow);
        color: var(--accent);
        border-left-color: var(--accent);
      }

      .nav-item .count {
        margin-left: auto;
        font-size: 11px;
        color: var(--text-muted);
        background: var(--bg-primary);
        padding: 1px 8px;
        border-radius: 10px;
        font-weight: 500;
      }

      .nav-item.active .count {
        color: var(--accent-dim);
        background: rgba(103, 232, 249, 0.1);
      }

      .nav-icon {
        font-size: 16px;
        width: 20px;
        text-align: center;
        flex-shrink: 0;
      }

      .main {
        flex: 1;
        overflow-y: auto;
        padding: 24px 28px;
      }

      .main-header {
        margin-bottom: 24px;
      }

      .main-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
        letter-spacing: -0.02em;
      }

      .main-desc {
        font-size: 14px;
        color: var(--text-secondary);
        margin: 4px 0 0;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 16px;
      }

      .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: var(--text-muted);
      }

      .empty-state p {
        font-size: 15px;
        margin: 8px 0 0;
      }

      .empty-state .icon {
        font-size: 40px;
        opacity: 0.4;
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
        background: var(--text-muted);
      }

      @media (width < 640px) {
        .catalog {
          flex-direction: column;
        }
        .sidebar {
          width: 100%;
          border-right: none;
          border-bottom: 1px solid var(--border-color);
          max-height: 200px;
        }
        .main {
          padding: 16px;
        }
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `
  }

  connectedCallback() {
    this.catalog = catalogData as CategoryInfo[]
    this.allComponents = this.catalog.flatMap(c => c.components)
    this.navItems = [{ name: 'all', label: 'All Components', components: this.allComponents }, ...this.catalog]
    this.render()
    this.setupElements()
    this.setupEvents()
    requestAnimationFrame(() => this.selectCategory(0))
  }

  private setupElements() {
    if (!this.shadowRoot) return
    this.main = this.shadowRoot.querySelector('.main')
    this.searchInput = this.shadowRoot.querySelector('.search-input')
    this.dropdown = this.shadowRoot.querySelector('.predictions')
    this.modal = this.shadowRoot.querySelector('component-catalog-modal')
  }

  private setupEvents() {
    if (!this.shadowRoot) return

    this.shadowRoot.addEventListener('click', e => {
      const item = (e.target as HTMLElement).closest('.nav-item') as HTMLElement | null
      if (item && item.dataset.index !== undefined) {
        this.selectCategory(Number(item.dataset.index))
      }
    })

    this.shadowRoot.addEventListener('click', e => {
      const pred = (e.target as HTMLElement).closest('.prediction-item') as HTMLElement | null
      if (pred && pred.dataset.catindex !== undefined) {
        this.selectCategory(Number(pred.dataset.catindex))
        if (this.searchInput) {
          this.searchInput.value = ''
          this.searchQuery = ''
        }
        this.hidePredictions()
        this.renderMain()
      }
    })

    this.shadowRoot.addEventListener('card-click', (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.componentInfo) this.openModal(detail.componentInfo)
    })

    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => {
        this.searchQuery = this.searchInput?.value.toLowerCase() || ''
        this.activeSuggestion = -1
        this.updatePredictions()
        this.renderMain()
      })

      this.searchInput.addEventListener('keydown', e => {
        if (!this.dropdown || this.dropdown.style.display === 'none') return
        const items = this.dropdown.querySelectorAll('.prediction-item')

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            this.activeSuggestion = Math.min(this.activeSuggestion + 1, items.length - 1)
            this.highlightSuggestion()
            break
          case 'ArrowUp':
            e.preventDefault()
            this.activeSuggestion = Math.max(this.activeSuggestion - 1, 0)
            this.highlightSuggestion()
            break
          case 'Enter':
            e.preventDefault()
            if (this.activeSuggestion >= 0 && this.activeSuggestion < items.length) {
              const item = items[this.activeSuggestion] as HTMLElement
              const idx = item.dataset.catindex
              if (idx !== undefined) {
                this.selectCategory(Number(idx))
                if (this.searchInput) {
                  this.searchInput.value = ''
                  this.searchQuery = ''
                }
                this.hidePredictions()
                this.renderMain()
              }
            }
            break
          case 'Escape':
            this.hidePredictions()
            break
        }
      })

      this.searchInput.addEventListener('blur', () => {
        setTimeout(() => this.hidePredictions(), 150)
      })

      this.searchInput.addEventListener('focus', () => {
        if (this.searchQuery) this.showPredictions()
      })
    }
  }

  private get predictions(): { comp: ComponentInfo; catIndex: number }[] {
    if (!this.searchQuery) return []
    const q = this.searchQuery
    const seen = new Set<string>()
    const results: { comp: ComponentInfo; catIndex: number }[] = []

    for (const [ci, cat] of this.catalog.entries()) {
      for (const comp of cat.components) {
        if (seen.has(comp.tagName)) continue
        if (comp.tagName.toLowerCase().includes(q) || comp.className.toLowerCase().includes(q)) {
          seen.add(comp.tagName)
          results.push({ comp, catIndex: ci + 1 })
        }
      }
    }

    return results.slice(0, 8)
  }

  private showPredictions() {
    if (this.dropdown) this.dropdown.classList.add('visible')
  }

  private hidePredictions() {
    if (this.dropdown) this.dropdown.classList.remove('visible')
    this.activeSuggestion = -1
  }

  private highlightSuggestion() {
    if (!this.dropdown) return
    const items = this.dropdown.querySelectorAll('.prediction-item')
    items.forEach((el, i) => {
      el.classList.toggle('highlighted', i === this.activeSuggestion)
    })
    const active = items[this.activeSuggestion] as HTMLElement | null
    if (active) active.scrollIntoView({ block: 'nearest' })
  }

  private updatePredictions() {
    if (!this.dropdown) return

    const results = this.predictions

    if (results.length === 0 || !this.searchQuery) {
      this.hidePredictions()
      return
    }

    this.dropdown.innerHTML = results
      .map(
        r => /* html */ `
      <div class="prediction-item" data-catindex="${r.catIndex}">
        <span class="prediction-tag">&lt;${r.comp.tagName}&gt;</span>
        <span class="prediction-cat">${this.catalog[r.catIndex - 1]?.label ?? ''}</span>
      </div>
    `,
      )
      .join('')

    this.showPredictions()
  }

  private selectCategory(index: number) {
    this.selectedIndex = index
    if (!this.shadowRoot) return

    this.shadowRoot.querySelectorAll('.nav-item').forEach(el => {
      el.classList.remove('active')
    })
    const active = this.shadowRoot.querySelector(`.nav-item[data-index="${index}"]`)
    active?.classList.add('active')

    this.renderMain()
  }

  private cardPreviewHTML(comp: ComponentInfo): string {
    const overrides: Record<string, string> = {
      'code-snippet': `<code-snippet lang="typescript"><pre>import { defineComponent } from 'vue';\n\nexport default defineComponent({\n  name: 'App',\n  setup() {\n    const count = ref(0)\n    return { count }\n  }\n})</pre></code-snippet>`,
      'key-shortcut': `<key-shortcut keys="Ctrl+T"></key-shortcut>`,
      'collapsible-accordion': `<collapsible-accordion><span slot="title">What is this?</span><div slot="content">A reusable web component for collapsible content sections.</div></collapsible-accordion>`,
      'progress-ring': `<progress-ring percent="65"></progress-ring>`,
      'custom-select': `<custom-select data-preview></custom-select>`,
      'avatar-group': `<avatar-group data-preview></avatar-group>`,
      'copy-button': `<copy-button text="npm install @myorg/ui"></copy-button>`,
      'visual-divider': `<visual-divider>Section</visual-divider>`,
      'segmented-control': `<segmented-control><button aria-selected="true">Day</button><button>Week</button><button>Month</button></segmented-control>`,
      'timeline-item': `<timeline-item time="2 min ago" status="success">Build passed</timeline-item>`,
      'toast-manager': /* html */ `<div style="display:flex;flex-direction:column;gap:8px;width:100%;font-family:system-ui,sans-serif">
        <div style="background:#1a1a1a;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;animation:slideIn 0.2s ease-out">Task completed!</div>
        <div style="background:#1a1a1a;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;animation:slideIn 0.3s ease-out">New message received</div>
      </div>`,
    }
    return overrides[comp.tagName] || `<${comp.tagName}></${comp.tagName}>`
  }

  private modalPreviewHTML(comp: ComponentInfo): string {
    const overrides: Record<string, string> = {
      'code-snippet': `<code-snippet lang="typescript"><pre>import { defineComponent } from 'vue';\n\nexport default defineComponent({\n  name: 'App',\n  setup() {\n    const count = ref(0)\n    return { count }\n  }\n})</pre></code-snippet>`,
      'key-shortcut': `<key-shortcut keys="Ctrl+S"></key-shortcut>`,
      'collapsible-accordion': `<collapsible-accordion><span slot="title">What is this?</span><div slot="content">A reusable web component for collapsible content sections.</div></collapsible-accordion>`,
      'progress-ring': `<progress-ring percent="65"></progress-ring>`,
      'custom-select': `<custom-select data-modal-preview></custom-select>`,
      'avatar-group': `<avatar-group data-modal-preview></avatar-group>`,
      'copy-button': `<copy-button text="npm install @myorg/ui"></copy-button>`,
      'visual-divider': `<div style="display:flex;flex-direction:column;gap:8px;width:100%"><span>Above</span><visual-divider>Section</visual-divider><span>Below</span></div>`,
      'segmented-control': `<segmented-control><button aria-selected="true">Day</button><button>Week</button><button>Month</button></segmented-control>`,
      'timeline-item': `<div style="display:flex;flex-direction:column;width:100%">
        <timeline-item time="10:30 AM" status="success">Build #42 passed</timeline-item>
        <timeline-item time="9:15 AM" status="pending">Review pending</timeline-item>
        <timeline-item time="8:00 AM">Pipeline started</timeline-item>
      </div>`,
      'toast-manager': `<toast-manager inline data-modal-preview></toast-manager>`,
    }
    return overrides[comp.tagName] || `<${comp.tagName}></${comp.tagName}>`
  }

  private setupModalPreview(container: HTMLElement) {
    const selects = container.querySelectorAll<HTMLElement>('custom-select[data-modal-preview]')
    selects.forEach(el => {
      ;(el as any).setOptions = [
        { value: 'react', label: 'React', icon: '⚛️' },
        { value: 'vue', label: 'Vue', icon: '💚' },
        { value: 'angular', label: 'Angular', icon: '🔴' },
      ]
    })

    const groups = container.querySelectorAll<HTMLElement>('avatar-group[data-modal-preview]')
    groups.forEach(el => {
      ;(el as any).items = [
        { src: 'https://i.pravatar.cc/80?u=1', alt: 'User 1' },
        { src: 'https://i.pravatar.cc/80?u=2', alt: 'User 2' },
        { src: 'https://i.pravatar.cc/80?u=3', alt: 'User 3' },
        { src: 'https://i.pravatar.cc/80?u=4', alt: 'User 4' },
      ]
    })

    const toasts = container.querySelectorAll<HTMLElement>('toast-manager[data-modal-preview]')
    toasts.forEach(el => {
      setTimeout(() => (el as any).addToast('Task completed successfully!'), 100)
      setTimeout(() => (el as any).addToast('New message received'), 700)
    })
  }

  private openModal(comp: ComponentInfo) {
    if (!this.modal) return
    const html = this.modalPreviewHTML(comp)
    ;(this.modal as any).show(comp, html)
    this.setupModalPreview(this.modal.shadowRoot?.querySelector('.body') as HTMLElement)
  }

  private renderSidebar() {
    const icons: Record<string, string> = {
      all: '🔸',
      alerts: '⚠️',
      badges: '🏷️',
      customs: '⚙️',
      skeletons: '🦴',
      timelines: '📏',
      dividers: '',
    }

    return /* html */ `
      <div class="sidebar" role="navigation" aria-label="Component categories">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Categories</h2>
          <search role="search">
            <input class="search-input" type="search" placeholder="Search components..." aria-label="Search components" autocomplete="off" />
            <div class="predictions" role="listbox" aria-label="Search suggestions"></div>
          </search>
        </div>
        <ul class="nav" role="tablist" aria-label="Component categories">
          ${this.navItems
            .map(
              (cat, i) => /* html */ `
            <li class="nav-item${i === this.selectedIndex ? ' active' : ''}" data-index="${i}" role="tab" aria-selected="${i === this.selectedIndex}" tabindex="${i === this.selectedIndex ? '0' : '-1'}">
              <span class="nav-icon" aria-hidden="true">${icons[cat.name] || '📦'}</span>
              ${cat.label}
              <span class="count" aria-label="${cat.components.length} component${cat.components.length !== 1 ? 's' : ''}">${cat.components.length}</span>
            </li>
          `,
            )
            .join('')}
        </ul>
      </div>
    `
  }

  private renderMain() {
    if (!this.shadowRoot) return
    if (!this.main) {
      this.main = this.shadowRoot.querySelector('.main')
      if (!this.main) return
    }

    const category = this.navItems[this.selectedIndex]
    if (!category) return

    const query = this.searchQuery
    const filtered =
      query ?
        category.components.filter(
          c => c.tagName.toLowerCase().includes(query) || c.className.toLowerCase().includes(query),
        )
      : category.components

    this.main.innerHTML = /* html */ `
      <div class="main-header">
        <h2 class="main-title">${category.label}</h2>
        <p class="main-desc">${filtered.length} component${filtered.length !== 1 ? 's' : ''}</p>
      </div>
      ${
        filtered.length === 0 ?
          /* html */ `<div class="empty-state">
               <div class="icon">🔍</div>
               <p>No components match "${this.searchQuery}"</p>
             </div>`
        : /* html */ `<div class="grid">
              ${filtered.map(() => /* html */ `<component-catalog-card></component-catalog-card>`).join('')}
            </div>`
      }
    `

    const cards = this.shadowRoot.querySelectorAll<HTMLElement>('component-catalog-card')
    cards.forEach((card, i) => {
      const comp = filtered[i]
      if (!comp) return
      const cardData: CardData = {
        tagName: comp.tagName,
        previewHTML: this.cardPreviewHTML(comp),
        componentInfo: comp,
        attributes: comp.attributes,
      }
      ;(card as any).data = cardData
    })
  }

  private render() {
    if (!this.shadowRoot) return

    this.shadowRoot.innerHTML = /* html */ `
      <style>${ComponentCatalogElement.styles}</style>
      <div class="catalog">
        ${this.renderSidebar()}
        <div class="main"></div>
      </div>
      <component-catalog-modal></component-catalog-modal>
    `
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.ComponentCatalogElement = ComponentCatalogElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
