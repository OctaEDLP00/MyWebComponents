/**
 * A semantic collapsible accordion section using shadow DOM slots.
 * @extends HTMLElement
 */
export class CollapsibleAccordionElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'collapsible-accordion', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  connectedCallback(): void {
    this.render()
  }

  static get styles(): string {
    return /* css */ `
      :host {
        display: block;
        width: 100%;
        min-width: 100%;
        border-bottom: 1px solid #eaeaea;
        font-family: system-ui, sans-serif;
        box-sizing: border-box;
      }
      details {
        padding: 16px 0;
      }
      summary {
        font-weight: 600;
        cursor: pointer;
        list-style: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: '➔';
        transition: transform 0.2s ease;
      }
      details[open] summary::after {
        transform: rotate(90deg);
      }
      .content {
        padding-top: 12px;
        color: #444;
      }
    `
  }

  render(): void {
    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${CollapsibleAccordionElement.styles}</style>
      <details>
        <summary><slot name="title">Accordion Title</slot></summary>
        <div class="content">
          <slot name="content">No content provided.</slot>
        </div>
      </details>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.CollapsibleAccordionElement = CollapsibleAccordionElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
