export class AlertCautionElement extends HTMLElement {
  size: Size = 'md'

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'alert-caution', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes() {
    return ['size']
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'size' && oldValue !== newValue) {
      this.size = (newValue as Size) || 'md'
      this.render()
    }
  }

  connectedCallback() {
    this.render()
  }

  static styles() {
    return /* css */ `
			:host {
				--alert-caution-bg: transparent;
				--alert-caution-fg: #f85149;
				--alert-caution-border: #da3633;
				display: block;
				background-color: var(--alert-caution-bg);
			}

			.alert-caution {
				padding: 0.5rem 1rem;
				margin-bottom: 1rem;
				color: inherit;
				border-left: .25em solid var(--alert-caution-border);
			}

			.alert-title {
				font-weight: 600;
				display: flex;
				align-items: center;
				margin: 0 0 14px 0;
				color: var(--alert-caution-fg);
			}

			.alert-caution-icon {
				margin-right: .5rem;
				display: inline-block;
				overflow: visible !important;
				vertical-align: text-bottom;
				fill: currentColor;
			}

			.code-line {
				margin-bottom: 0;
				position: relative;
			}
		`
  }

  render() {
    if (!this.shadowRoot) return

    this.shadowRoot.setHTMLUnsafe(/* html */ `
			<style>${AlertCautionElement.styles()}</style>
			<div class="alert-caution">
				<p class="alert-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="alert-caution-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.47.22A.75.75 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.75.75 0 0 1-.22.53l-4.25 4.25A.75.75 0 0 1 11 16H5a.75.75 0 0 1-.53-.22L.22 11.53A.75.75 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4m0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/></svg>
					Caution
				</p>
				<p
					class="code-line"
					dir="auto"
				>
					<slot>Proceed carefully before continuing.</slot>
				</p>
			</div>
		`)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.AlertCautionElement = AlertCautionElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
