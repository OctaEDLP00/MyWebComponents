/**
 * A custom alert note component that provides visual alerts using native CSS.
 * @extends {HTMLElement}
 */
export class AlertNoteElement extends HTMLElement {
  size: Size = 'md'

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'alert-note', registry = customElements) {
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
				--alert-note-bg: transparent;
				--alert-note-fg: #4493f8;
				--alert-note-border: #1f6feb;
				display: block;
				background-color: var(--alert-note-bg);
			}

			.alert-note {
				padding: 0.5rem 1rem;
				margin-bottom: 1rem;
				color: inherit;
				border-left: .25em solid var(--alert-note-border);
			}

			.alert-title {
				font-weight: 600;
				display: flex;
				align-items: center;
				margin: 0 0 14px 0;
				color: var(--alert-note-fg);
			}

			.alert-note-icon {
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

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
			<style>${AlertNoteElement.styles()}</style>
			<div class="alert-note">
				<p class="alert-title">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="alert-note-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13M6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75M8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/></svg>
					Note
				</p>
				<p class="code-line" dir="auto">
					<slot>Additional information related to this content.</slot>
				</p>
			</div>
		`)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.AlertNoteElement = AlertNoteElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
