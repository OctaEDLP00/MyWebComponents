export class ManagerToastElement extends HTMLElement {
  private toastCount = 0

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'toast-manager', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  public addToast(message?: string, duration: number = 3000): void {
    const container = this.shadowRoot?.querySelector('.toast-container')
    if (!container) return

    const text = message || `Toast #${++this.toastCount}`
    const toast = document.createElement('div')
    toast.classList.add('toast')
    toast.textContent = text
    container.appendChild(toast)

    setTimeout(() => {
      toast.style.transition = 'opacity 0.2s ease'
      toast.style.opacity = '0'
      setTimeout(() => toast.remove(), 200)
    }, duration)
  }

  connectedCallback(): void {
    this.render()
    this.shadowRoot?.addEventListener('click', e => {
      if ((e.target as HTMLElement).closest('.trigger-btn')) {
        this.addToast()
      }
    })
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    if (name === 'inline') this.render()
  }

  static get observedAttributes(): string[] {
    return ['inline']
  }

  static get styles(): string {
    return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-family: system-ui, sans-serif;
      }
      :host(:not([inline])) {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      }
      :host([inline]) {
        position: relative;
        align-items: center;
      }
      .trigger-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: #0070f3;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-family: inherit;
        transition: background 0.2s;
      }
      .trigger-btn:hover {
        background: #0051a8;
      }
      .toast-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .toast {
        background: #1a1a1a;
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.2s ease-out forwards;
        opacity: 0;
      }
      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `
  }

  render(): void {
    const isInline = this.hasAttribute('inline')

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${ManagerToastElement.styles}</style>
      ${isInline ? /* html */ `<button class="trigger-btn">+ Show Toast</button>` : ''}
      <div class="toast-container" role="status" aria-live="polite"></div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.ManagerToastElement = ManagerToastElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
