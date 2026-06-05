export class BadgeCustomElement extends HTMLElement {
  size: Size = 'md'
  variation: Variation | null = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'badge-custom', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes() {
    return ['size', 'variation']
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'size' && oldValue !== newValue) {
      this.size = (newValue as Size) || 'md'
      this.render()
    }
    if (name === 'variation' && oldValue !== newValue) {
      this.variation = (newValue as Variation) || 'md'
      this.render()
    }
  }

  connectedCallback() {
    this.render()
  }

  static styles() {
    return /* css */ `
			:host {
				/* Default Theme */
				--badge-border: #06b6d4;
				--badge-bg: #cffafe;
				--badge-fg: #155e75;

				/* Layout */
				display: inline-flex;
				vertical-align: middle;

				/* Design Tokens */
				--badge-radius: 9999px;
				--badge-border-width: 1px;

				--badge-font-family:
					Inter,
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					"Segoe UI",
					sans-serif;

				--badge-font-weight: 600;
				--badge-line-height: 1;

				--badge-padding-x: 0.75em;
				--badge-padding-y: 0.45em;

				--badge-gap: 0.4em;

				--badge-shadow:
					0 1px 2px rgb(0 0 0 / 0.08),
					inset 0 1px 0 rgb(255 255 255 / 0.08);

				--badge-transition:
					background-color 160ms ease,
					border-color 160ms ease,
					color 160ms ease,
					transform 120ms ease,
					box-shadow 160ms ease;
			}

			.badge {
				position: relative;

				display: inline-flex;
				align-items: center;
				justify-content: center;
				gap: var(--badge-gap);

				padding-inline: var(--badge-padding-x);
				padding-block: var(--badge-padding-y);

				border-radius: var(--badge-radius);
				border: var(--badge-border-width) solid var(--badge-border);

				background:
					linear-gradient(
						to bottom,
						rgb(255 255 255 / 0.08),
						rgb(255 255 255 / 0)
					),
					var(--badge-bg);

				color: var(--badge-fg);

				font-family: var(--badge-font-family);
				font-weight: var(--badge-font-weight);
				line-height: var(--badge-line-height);
				white-space: nowrap;

				box-shadow: var(--badge-shadow);

				user-select: none;
				-webkit-user-select: none;

				backdrop-filter: blur(10px);

				transition: var(--badge-transition);
			}

			/* Hover */
			.badge:hover {
				transform: translateY(-1px);

				box-shadow:
					0 4px 10px rgb(0 0 0 / 0.12),
					inset 0 1px 0 rgb(255 255 255 / 0.12);
			}

			/* Active */
			.badge:active {
				transform: translateY(0);
			}

			/* Icon */
			svg {
				width: 1em;
				height: 1em;
				flex-shrink: 0;
			}

			/* Sizes */
			.sm {
				font-size: 0.75rem;
				padding-inline: 0.65em;
				padding-block: 0.35em;
			}

			.md {
				font-size: 0.875rem;
			}

			.lg {
				font-size: 1rem;
				padding-inline: 0.9em;
				padding-block: 0.5em;
			}

			.xl {
				font-size: 1.125rem;
				padding-inline: 1em;
				padding-block: 0.6em;
			}

			/* Outline Variant */
			.outline {
				background: transparent;
				box-shadow: none;
			}

			/* Soft Variant */
			.soft {
				border-color: transparent;
				box-shadow: none;
			}

			/* Solid Variant */
			.solid {
				filter: saturate(1.05) contrast(1.02);
			}
		`
  }

  render() {
    if (!this.shadowRoot) return

    this.shadowRoot.setHTMLUnsafe(/* html */ `
			<style>${BadgeCustomElement.styles()}</style>
			<div class="badge ${this.size} ${this.variation ?? ''}">
				<slot name="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M8.15 21.75 6.7 19.3l-2.75-.6q-.375-.075-.6-.387t-.175-.688L3.45 14.8l-1.875-2.15q-.25-.275-.25-.65t.25-.65L3.45 9.2l-.275-2.825q-.05-.375.175-.688t.6-.387l2.75-.6 1.45-2.45q.2-.325.55-.438t.7.038l2.6 1.1 2.6-1.1q.35-.15.7-.038t.55.438L17.3 4.7l2.75.6q.375.075.6.388t.175.687L20.55 9.2l1.875 2.15q.25.275.25.65t-.25.65L20.55 14.8l.275 2.825q.05.375-.175.688t-.6.387l-2.75.6-1.45 2.45q-.2.325-.55.438t-.7-.038l-2.6-1.1-2.6 1.1q-.35.15-.7.038t-.55-.438m1.3-1.8 2.55-1.1 2.6 1.1 1.4-2.4 2.75-.65-.25-2.8 1.85-2.1-1.85-2.15.25-2.8-2.75-.6-1.45-2.4L12 5.15l-2.6-1.1L8 6.45l-2.75.6.25 2.8L3.65 12l1.85 2.1-.25 2.85 2.75.6zM12 17q.425 0 .713-.288T13 16t-.288-.712T12 15t-.712.288T11 16t.288.713T12 17m0-4q.425 0 .713-.288T13 12V8q0-.425-.288-.712T12 7t-.712.288T11 8v4q0 .425.288.713T12 13"/></svg>
				</slot>
				<slot name="text">CUSTOM</slot>
			</div>
		`)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.BadgeCustomElement = BadgeCustomElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
