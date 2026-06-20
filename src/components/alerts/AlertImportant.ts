/**
 * A custom alert note component that provides visual alerts using native CSS.
 * @extends {HTMLElement}
 */
export class AlertImportantElement extends HTMLElement {
  size: Size = 'md'

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'alert-important', registry = customElements) {
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
				--alert-important-bg: transparent;
				--alert-important-border: #8957e5;
				--alert-important-fg: #9f72ed;
				display: block;
				background-color: var(--alert-important-bg);
			}

			.alert-important {
				padding: 0.5rem 1rem;
				margin-bottom: 1rem;
				color: inherit;
				border-left: .25em solid var(--alert-important-border);
			}

			.alert-title {
				font-weight: 600;
				display: flex;
				align-items: center;
				margin: 0 0 14px 0;
				color: var(--alert-important-fg);
			}

			.alert-important-icon {
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
			<style>${AlertImportantElement.styles()}</style>
			<div class="alert-important">
				<p class="alert-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="alert-important-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.75.75 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0M9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
					Important
				</p>
				<p class="code-line" dir="auto">
					<slot>Read this carefully before proceeding.</slot>
				</p>
			</div>
		`)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.AlertImportantElement = AlertImportantElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
