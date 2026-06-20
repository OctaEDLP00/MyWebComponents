/**
 * A layout dividing rule with optional text branding or slots.
 * @extends HTMLElement
 */
export class VisualDividerElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  public static define(tag = 'visual-divider', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes(): string[] {
    return ['orientation']
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
        display: flex;
        align-items: center;
        color: #94a3b8;
        font-size: 13px;
        font-family: system-ui, sans-serif;
        margin: 16px 0;
      }
      :host([orientation="vertical"]) {
        display: inline-flex;
        flex-direction: column;
        height: 100%;
        min-height: 24px;
        margin: 0 16px;
        vertical-align: middle;
      }
      .rule {
        flex-grow: 1;
        background-color: #e2e8f0;
      }
      :host(:not([orientation="vertical"])) .rule {
        height: 1px;
      }
      :host([orientation="vertical"]) .rule {
        width: 1px;
      }
      .label-holder {
        padding: 0 8px;
      }
      :host([orientation="vertical"]) .label-holder {
        padding: 8px 0;
      }
    `
  }

  public render(): void {
    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${VisualDividerElement.styles}</style>
      <div class="rule"></div>
      <div class="label-holder">
        <slot></slot>
      </div>
      <div class="rule"></div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.VisualDividerElement = VisualDividerElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
