/**
 * A modern floating label input element.
 * @extends HTMLElement
 */
export class FloatingInputElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  /**
   * Registers the component in the custom elements registry.
   * @param {string} [tag='floating-input'] - The HTML tag name.
   * @param {CustomElementRegistry} [registry=customElements] - The element registry.
   * @returns {typeof FloatingInputElement}
   */
  public static define(tag = 'floating-input', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes(): string[] {
    return ['label', 'type', 'placeholder']
  }

  public connectedCallback(): void {
    this.render()
  }

  public disconnectedCallback(): void {}

  public attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    this.render()
  }

  static get styles(): string {
    return /* css */ `
      :host {
        display: block;
        margin-bottom: 16px;
        font-family: system-ui, sans-serif;
      }
      .field-container {
        position: relative;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0;
        background: #fff;
        transition: border-color 0.2s;
      }
      .field-container:focus-within {
        border-color: #0066cc;
        box-shadow: 0 0 0 1px #0066cc;
      }
      input {
        width: 100%;
        border: none;
        outline: none;
        padding: 20px 12px 6px 12px;
        font-size: 16px;
        box-sizing: border-box;
        background: transparent;
      }
      label {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        transition: all 0.2s ease;
        pointer-events: none;
        font-size: 16px;
      }
      input:focus + label,
      input:not(:placeholder-shown) + label {
        top: 10px;
        font-size: 12px;
        color: #0066cc;
      }
    `
  }

  public render(): void {
    const label = this.getAttribute('label') || 'Text field'
    const type = this.getAttribute('type') || 'text'

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${FloatingInputElement.styles}</style>
      <div class="field-container">
        <input type="${type}" placeholder=" " id="input-field" />
        <label for="input-field">${label}</label>
      </div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.FloatingInputElement = FloatingInputElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
