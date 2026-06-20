/**
 * @typedef {Object} AvatarItem
 * @property {string} src - The image URL for the avatar.
 * @property {string} alt - The alternative text.
 */

/**
 * A component that renders a stacked group of user avatars.
 * @extends HTMLElement
 */
export class AvatarGroupElement extends HTMLElement {
  #items: Array<{ src: string; alt: string }> = []

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'avatar-group', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes(): string[] {
    return ['max']
  }

  connectedCallback(): void {
    this.render()
  }

  disconnectedCallback(): void {}

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    this.render()
  }

  /**
   * Sets the list of avatars.
   * @param {AvatarItem[]} data - Array of avatar data objects.
   */
  set items(data: Array<{ src: string; alt: string }>) {
    this.#items = data
    this.render()
  }

  static get styles(): string {
    return /* css */ `
      :host {
        display: inline-flex;
        align-items: center;
      }
      .container {
        display: flex;
        flex-direction: row;
      }
      .avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        margin-right: -12px;
        object-fit: cover;
        background-color: #e0e0e0;
      }
      .counter {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid #ffffff;
        background-color: #f1f3f5;
        color: #495057;
        font-size: 13px;
        font-weight: 600;
        font-family: system-ui, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
      }
    `
  }

  render(): void {
    const max = Math.max(1, Number(this.getAttribute('max')) || 3)
    const visibleItems = this.#items.slice(0, max)
    const extraCount = this.#items.length - max

    const imagesHTML = visibleItems
      .map((item, index) => {
        const zIndex = visibleItems.length - index
        return /* html */ `<img class="avatar" src="${item.src}" alt="${item.alt || ''}" style="z-index: ${zIndex};" />`
      })
      .join('')

    const counterHTML = extraCount > 0 ? /* html */ `<div class="counter">+${extraCount}</div>` : ''

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${AvatarGroupElement.styles}</style>
      <div class="container">
        ${imagesHTML}
        ${counterHTML}
      </div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.AvatarGroupElement = AvatarGroupElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
