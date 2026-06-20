/**
 * A highly interactive segmented control selector.
 * @extends HTMLElement
 */
export class SegmentControlElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'segmented-control', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  connectedCallback(): void {
    this.render()
    this.shadowRoot?.querySelector('.wrapper')?.addEventListener('click', e => this.handleInteraction(e))
  }

  private handleInteraction(e: Event): void {
    const target = e.target as HTMLElement
    if (target.tagName !== 'BUTTON') return

    const buttons = Array.from(this.querySelectorAll('button'))
    buttons.forEach(btn => btn.setAttribute('aria-selected', 'false'))

    target.setAttribute('aria-selected', 'true')

    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { value: target.dataset.value || target.textContent },
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
      }
      .wrapper {
        display: flex;
        background-color: #f1f3f5;
        padding: 4px;
        border-radius: 8px;
        gap: 2px;
      }
      ::slotted(button) {
        background: none;
        border: none;
        padding: 6px 12px;
        font-size: 14px;
        font-weight: 500;
        color: #495057;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.15s, color 0.15s;
      }
      ::slotted(button[aria-selected="true"]) {
        background-color: #ffffff;
        color: #212529;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }
    `
  }

  render(): void {
    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${SegmentControlElement.styles}</style>
      <div class="wrapper" role="tablist">
        <slot></slot>
      </div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.SegmentControlElement = SegmentControlElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
