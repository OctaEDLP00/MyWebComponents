export class KeyShortcutElement extends HTMLElement {
  keys: string | null = null
  forceMac: boolean = false
  pressedKeys: Set<string> = new Set()

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'key-shortcut', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes() {
    return ['keys', 'mac']
  }

  connectedCallback(): void {
    this.keys = this.getAttribute('keys') ?? 'Ctrl + T'
    this.forceMac = this.hasAttribute('mac') ?? this.forceMac
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    this.render()
  }

  disconnectedCallback(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    switch (name) {
      case 'keys':
        this.keys = newValue
        break
      case 'mac':
        this.forceMac = this.hasAttribute('mac')
        break
    }
    this.render()
  }

  detectOS(): OS {
    if (this.forceMac) return 'mac'
    const ua = navigator.userAgent.toLowerCase()
    if (/macintosh|mac os x/.test(ua)) return 'mac'
    if (/windows nt/.test(ua)) return 'windows'
    if (/android/.test(ua)) return 'android'
    if (/iphone|ipad|ipod/.test(ua)) return 'ios'
    if (/linux/.test(ua)) return 'linux'
    return 'unknown'
  }

  formatKeys(): string {
    const os = this.detectOS()
    const isMac = os === 'mac'

    const raw = this.keys
    if (!raw) return ''

    const normalized = raw.replace(/\s*\+\s*/g, '+')
    const sequences: Array<string> = normalized.split(/\s+/)

    return sequences
      .map(seq => {
        const keys = seq.split('+').map(k => {
          switch (k) {
            case 'win':
              return '⊞'
            case 'ctrl':
              return isMac ? '⌘' : 'Ctrl'
            case 'cmd':
              return '⌘'
            case 'alt':
              return isMac ? '⌥' : 'Alt'
            case 'shift':
              return 'Shift'
            default:
              return k.toUpperCase()
          }
        })

        return /* html */ `<span class="combo">${keys.map(k => /* html */ `<kbd data-key="${k}">${k}</kbd>`).join('')}</span>`
      })
      .join(/* html */ `<span>&nbsp;</span>`)
  }

  /**
   * @param {string} key
   */
  normalizeKey(key: string): string {
    const isMac = navigator.platform.includes('Mac')
    switch (key) {
      case 'Control':
        return isMac ? '⌘' : 'Ctrl'
      case 'Meta':
        return isMac ? '⌘' : 'Win'
      case 'Alt':
        return isMac ? '⌥' : 'Alt'
      case 'Shift':
        return 'Shift'
      case ' ':
        return 'Space'
      default:
        return key.length === 1 ? key.toUpperCase() : key
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown = ({ key }: KeyboardEvent): void => {
    const normalizeKey = this.normalizeKey(key)
    this.pressedKeys.add(normalizeKey)
    this.highlightKeys()
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyUp = ({ key }: KeyboardEvent): void => {
    const normalizeKey = this.normalizeKey(key)
    this.pressedKeys.delete(normalizeKey)
    this.highlightKeys()
  }

  highlightKeys(): void {
    const allKeys = Array.from(this.shadowRoot!.querySelectorAll('kbd')) ?? []
    allKeys.map(kbdEl => {
      const keyAttr = kbdEl.getAttribute('data-key')
      if (keyAttr && this.pressedKeys.has(keyAttr)) {
        kbdEl.classList.add('pressed')
      } else {
        kbdEl.classList.remove('pressed')
      }
    })
  }

  static styles() {
    return /* css */ `
			:host {
				--keyboard-font: consolas, monospace;
				--keyboard-weight: 500;
				--keyboard-color-light: white;
				--keyboard-bg-light: #444;
				--keyboard-color-dark: #444;
				--keyboard-bg-dark: white;
				--keyboard-font-size: 1.45rem;
				--keyboard-shadow-light: #444;
				--keyboard-shadow-dark: white;
				--keyboard-shadow-light-press: #444;
				--keyboard-shadow-dark-press: white;

				display: inline-block;
				font-size: var(--keyboard-font-size);
				font-weight: var(--keyboard-weight);
				text-rendering: optimizeLegibility;
			}

			.shortcut-sequence {
				display: inline-flex;
				align-items: center;
				gap: 6px;
				padding: 6px 9px;
				color: light-dark(var(--keyboard-color-light), var(--keyboard-color-dark));
				font-size: var(--keyboard-font-size);
				line-height: 1;
			}

			.combo {
				display: inline-flex;
				gap: 0.25rem;
			}

			kbd {
				display: inline-block;
				padding: 8px 14px;
				margin: 0 0.75px;
				background-color: light-dark(var(--keyboard-bg-light, #e2e5e9), var(--keyboard-bg-dark, #2a2d30));
				border: 1px solid light-dark(#b4b4b4, #444);
				border-top: 2px solid light-dark(#fff, #444);
				border-bottom: 3px solid light-dark(#999, #111);
				border-radius: 6px;
				box-shadow:
					0 3px 0 light-dark(var(--keyboard-shadow-light), var(--keyboard-shadow-dark)),
					0 3px 6px rgba(0, 0, 0, 0.3);
				text-shadow: 0 1px 0 rgba(255, 255, 255, 0.4);
				background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
				user-select: none;
				cursor: default;
				transition:
					transform 0.05s ease,
					box-shadow 0.05s ease;
			}

			kbd:active {
				transform: translateY(2px);
				box-shadow:
					0 1px 0 light-dark(var(--keyboard-shadow-light), var(--keyboard-shadow-dark)),
					0 1px 2px rgba(0, 0, 0, 0.2);
				border-bottom-width: 1px;
			}

			kbd:hover {
				filter: brightness(1.1);
			}

			kbd.pressed {
				transform: translateY(2px);
				box-shadow:
					0 1px 0 light-dark(var(--keyboard-shadow-light-press), var(--keyboard-shadow-dark-press)),
					0 1px 2px rgba(0, 0, 0, 0.2);
				border-bottom-width: 1px;
				transition:
					transform 0.1s ease,
					box-shadow 0.1s ease;
			}
		`
  }

  render(): void {
    if (!this.shadowRoot) return
    this.shadowRoot.setHTMLUnsafe(/*html */ `
      <style>${KeyShortcutElement.styles()}</style>
      <div class="shortcut-sequence">${this.formatKeys()}</div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.KeyShortcutElement = KeyShortcutElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
