/**
 * A button component that copies text to the clipboard.
 * @extends HTMLElement
 */
export class CopyButtonElement extends HTMLElement {
  #isCopying: boolean = false

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'copy-button', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes(): string[] {
    return ['text']
  }

  connectedCallback(): void {
    this.render()
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    this.render()
  }

  static get styles(): string {
    return /* css */ `
      button {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background-color: #0070f3;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-family: system-ui, sans-serif;
        transition: background-color 0.2s ease;
      }
      button:hover {
        background-color: #0051a8;
      }
      button.success {
        background-color: #10b981;
      }
      svg {
        width: 16px;
        height: 16px;
        fill: none;
        stroke: currentColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
      }
    `
  }

  #copy(): void {
    if (this.#isCopying) return
    const textToCopy = this.getAttribute('text') || ''
    if (!textToCopy) return

    this.#isCopying = true
    const button = this.shadowRoot?.querySelector('button') as HTMLButtonElement | null
    if (!button) return

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        if (!button) return
        button.classList.add('success')
        button.innerHTML = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`

        setTimeout(() => {
          button.classList.remove('success')
          button.innerHTML = `<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy`
          this.#isCopying = false
        }, 2000)
      })
      .catch((err: Error) => {
        console.error('Failed to copy text: ', err)
        this.#isCopying = false
      })
  }

  render(): void {
    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${CopyButtonElement.styles}</style>
      <button type="button">
        <svg viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy
      </button>
    `)

    this.shadowRoot?.querySelector('button')?.addEventListener('click', () => this.#copy())
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.CopyButtonElement = CopyButtonElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
