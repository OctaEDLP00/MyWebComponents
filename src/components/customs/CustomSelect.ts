export interface SelectOption {
  value: string
  label: string
  icon?: string
}

export class CustomSelectElement extends HTMLElement {
  private options: SelectOption[] = []
  private isOpen: boolean = false
  private selectedLabel: string = 'Select option...'

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'custom-select', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  connectedCallback(): void {
    this.render()
    this.setupListeners()
  }

  set setOptions(data: SelectOption[]) {
    this.options = data
    this.selectedLabel = 'Select option...'
    this.render()
    this.setupListeners()
  }

  private setupListeners(): void {
    const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null
    trigger?.addEventListener('click', () => this.toggle())

    this.shadowRoot?.addEventListener('keydown', (e: Event) => {
      if ((e as KeyboardEvent).key === 'Escape' && this.isOpen) this.toggle()
    })

    const listItems = this.shadowRoot?.querySelectorAll('.options-list li') || []
    listItems.forEach((li, index) => {
      li.addEventListener('click', () => this.#selectOption(this.options[index]))
      li.addEventListener('keydown', (e: Event) => {
        if ((e as KeyboardEvent).key === 'Enter') this.#selectOption(this.options[index])
      })
    })
  }

  private toggle(): void {
    this.isOpen = !this.isOpen
    const list = this.shadowRoot?.querySelector('.options-list') as HTMLUListElement | null
    const trigger = this.shadowRoot?.querySelector('.trigger') as HTMLButtonElement | null

    list?.classList.toggle('open', this.isOpen)
    trigger?.setAttribute('aria-expanded', String(this.isOpen))
  }

  #selectOption(option: SelectOption): void {
    if (!option) return
    this.selectedLabel = option.label
    this.render()
    this.setupListeners()
    this.isOpen = false

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: option.value },
        bubbles: true,
        composed: true,
      }),
    )
  }

  static get styles(): string {
    return /* css */ `
      :host {
        display: inline-block;
        font-family: system-ui, sans-serif;
        position: relative;
        width: 200px;
        color: #1a1a1a;
      }
      .trigger {
        padding: 8px 12px;
        background: #ffffff;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        color: inherit;
        gap: 8px;
      }
      .trigger:focus {
        outline: 2px solid #0066cc;
      }
      .trigger .label-wrap {
        display: flex;
        align-items: center;
        gap: 6px;
        flex: 1;
      }
      .trigger .icon {
        font-size: 16px;
        line-height: 1;
      }
      .options-list {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #ffffff;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 4px;
        padding: 0;
        list-style: none;
        display: none;
        max-height: 200px;
        overflow-y: auto;
        z-index: 10;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .options-list.open {
        display: block;
      }
      li {
        padding: 8px 12px;
        cursor: pointer;
        color: inherit;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      li:hover, li:focus {
        background-color: #f0f0f0;
        outline: none;
      }
      li .icon {
        font-size: 16px;
        line-height: 1;
        width: 20px;
        text-align: center;
        flex-shrink: 0;
      }
      .arrow {
        font-size: 10px;
        color: #666;
        flex-shrink: 0;
      }
    `
  }

  render(): void {
    const selectedOpt = this.options.find(o => o.label === this.selectedLabel)
    const selectedIcon = selectedOpt?.icon ? /* html */ `<span class="icon">${selectedOpt.icon}</span>` : ''

    const optionsHTML = this.options
      .map(
        opt => /* html */ `<li role="option" tabindex="0">
          ${opt.icon ? /* html */ `<span class="icon">${opt.icon}</span>` : ''}
          ${opt.label}
        </li>`,
      )
      .join('')

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${CustomSelectElement.styles}</style>
      <button class="trigger" aria-haspopup="listbox" aria-expanded="false">
        <span class="label-wrap">
          ${selectedIcon}
          <span class="label">${this.selectedLabel}</span>
        </span>
        <span class="arrow">▼</span>
      </button>
      <ul class="options-list" role="listbox" tabindex="-1">
        ${optionsHTML}
      </ul>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.CustomSelectElement = CustomSelectElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
