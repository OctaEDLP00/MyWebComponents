export class BadgeExperimentalElement extends HTMLElement {
  size: Size = 'md'
  variation: Variation | null = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'badge-experimental', registry = customElements) {
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
				--badge-border: #7c3aed;
				--badge-bg: #ede9fe;
				--badge-fg: #4c1d95;

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
			<style>${BadgeExperimentalElement.styles()}</style>
			<div class="badge ${this.size} ${this.variation ?? ''}">
				<!-- svg -->
				<slot>Experimental</slot>
			</div>
		`)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.BadgeExperimentalElement = BadgeExperimentalElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
