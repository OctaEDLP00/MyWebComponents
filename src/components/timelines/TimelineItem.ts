/**
 * An individual event node within a chronological timeline view.
 * @extends HTMLElement
 */
export class TimelineItemElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  public static define(tag = 'timeline-item', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes(): string[] {
    return ['time', 'status']
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
        font-family: system-ui, sans-serif;
        position: relative;
        padding-bottom: 24px;
      }
      :host(:last-child) .line {
        display: none;
      }
      .badge-indicator {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 16px;
      }
      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #cbd5e1;
      }
      .dot.success { background-color: #10b981; }
      .dot.pending { background-color: #f59e0b; }
      .line {
        width: 2px;
        flex-grow: 1;
        background-color: #e2e8f0;
        margin-top: 4px;
      }
      .content-pane {
        padding-top: -2px;
      }
      .time-stamp {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 4px;
      }
    `
  }

  public render(): void {
    const time = this.getAttribute('time') || ''
    const status = this.getAttribute('status') || 'default'

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${TimelineItemElement.styles}</style>
      <div class="badge-indicator">
        <div class="dot ${status}"></div>
        <div class="line"></div>
      </div>
      <div class="content-pane">
        ${time ? `<div class="time-stamp">${time}</div>` : ''}
        <slot></slot>
      </div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.TimelineItemElement = TimelineItemElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
