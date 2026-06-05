export class AlertTipElement extends HTMLElement {
  size: Size = 'md'

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'alert-tip', registry = customElements) {
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
				--alert-tip-bg: transparent;
				--alert-tip-border: #238636;
				--alert-tip-fg: #38ae41;
				display: block;
				background-color: var(--alert-tip-bg);
			}

			.alert-tip {
				padding: 0.5rem 1rem;
				margin-bottom: 1rem;
				color: inherit;
				border-left: .25em solid var(--alert-tip-border);
			}

			.alert-title {
				font-weight: 600;
				display: flex;
				align-items: center;
				margin: 0 0 14px 0;
				color: var(--alert-tip-fg);
			}

			.alert-tip-icon {
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
			<style>${AlertTipElement.styles()}</style>
			<div class="alert-tip">
				<p class="alert-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="alert-tip-icon" viewBox="0 0 16 16"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a9 9 0 0 0-.542-.68l-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259q-.142.172-.268.319c-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848l.213-.253c.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75M5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5M6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75"/></svg>
					Tip
				</p>
				<p class="code-line" dir="auto">
					<slot>Helpful advice to improve usage or results.</slot>
				</p>
			</div>
		`)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.AlertTipElement = AlertTipElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
