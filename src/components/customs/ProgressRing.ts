/**
 * A reactive circular progress ring component.
 * @extends HTMLElement
 */
export class ProgressRingElement extends HTMLElement {
  private percent: number = 0
  private radius: number = 52
  private circumference: number = this.radius * 2 * Math.PI

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'progress-ring', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes(): string[] {
    return ['percent']
  }

  connectedCallback(): void {
    this.percent = Number(this.getAttribute('percent')) || 0
    this.render()
  }

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    this.render()
  }

  static get styles(): string {
    return /* css */ `
      :host {
        display: inline-block;
      }
      circle {
        transition: stroke-dashoffset 0.35s;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
      }
    `
  }

  render(): void {
    const offset = this.circumference - (this.percent / 100) * this.circumference

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${ProgressRingElement.styles}</style>
      <svg height="120" width="120">
        <circle stroke="#e6e6e6" stroke-width="8" fill="transparent" r="${this.radius}" cx="60" cy="60"/>
        <circle class="progress" stroke="#0070f3" stroke-width="8" fill="transparent"
          r="${this.radius}" cx="60" cy="60"
          style="stroke-dasharray: ${this.circumference} ${this.circumference}; stroke-dashoffset: ${offset};">
        </circle>
      </svg>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.ProgressRingElement = ProgressRingElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
