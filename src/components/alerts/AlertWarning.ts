export class AlertWarningElement extends HTMLElement {
  size: Size = 'md'

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'alert-warning', registry = customElements) {
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
				--alert-warning-bg: transparent;
				--alert-warning-border: #9e6a03;
				--alert-warning-fg: #d1901f;
				display: block;
				background-color: var(--alert-warning-bg);
			}

			.alert-warning {
				padding: 0.5rem 1rem;
				margin-bottom: 1rem;
				color: inherit;
				border-left: .25em solid var(--alert-warning-border);
			}

			.alert-title {
				font-weight: 600;
				display: flex;
				align-items: center;
				margin: 0 0 14px 0;
				color: var(--alert-warning-fg);
			}

			.alert-warning-icon {
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
			<style>${AlertWarningElement.styles()}</style>
			<div class="alert-warning">
				<p class="alert-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="alert-warning-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0M9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>
					Warning
				</p>
				<p class="code-line" dir="auto">
					<slot>This action may produce unintended results.</slot>
				</p>
			</div>
		`)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.AlertWarningElement = AlertWarningElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
