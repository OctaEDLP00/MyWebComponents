import hljs from 'highlight.js'

export class CodeSnippetElement extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  static define(tag = 'code-snippet', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  static get observedAttributes(): string[] {
    return ['lang']
  }

  connectedCallback(): void {
    this.render()
    const slot = this.shadowRoot?.querySelector('slot')
    slot?.addEventListener('slotchange', () => this.highlight())
  }

  disconnectedCallback(): void {}

  attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return
    this.render()
  }

  private highlight(): void {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null
    if (!slot) return
    const code = slot.assignedNodes().map(n => n.textContent || '').join('')
    const lang = this.getAttribute('lang') || ''
    let result: { value: string }
    try {
      result = lang ? hljs.highlight(code, { language: lang }) : hljs.highlightAuto(code)
    } catch {
      result = hljs.highlightAuto(code)
    }
    const codeEl = this.shadowRoot?.querySelector('code')
    if (codeEl) codeEl.innerHTML = result.value
  }

  static get styles(): string {
    return /* css */ `
      :host {
        display: block;
        margin: 16px 0;
        font-family: monospace;
      }
      .wrapper {
        position: relative;
        background-color: #1e1e1e;
        border-radius: 8px;
        overflow: hidden;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #2d2d2d;
        padding: 8px 16px;
        color: #9cdcfe;
        font-size: 12px;
      }
      pre {
        margin: 0;
        padding: 16px;
        overflow-x: auto;
        color: #d4d4d4;
        font-size: 14px;
      }
      code {
        font-family: inherit;
      }
      .hljs-keyword { color: #c678dd; }
      .hljs-string { color: #98c379; }
      .hljs-comment { color: #5c6370; font-style: italic; }
      .hljs-function { color: #61afef; }
      .hljs-number { color: #d19a66; }
      .hljs-built_in { color: #e06c75; }
      .hljs-title { color: #61afef; }
      .hljs-params { color: #abb2bf; }
      .hljs-literal { color: #56b6c2; }
      .hljs-type { color: #e5c07b; }
      .hljs-attr { color: #d19a66; }
      .hljs-attribute { color: #d19a66; }
      .hljs-selector-tag { color: #e06c75; }
      .hljs-meta { color: #61afef; }
      .hljs-tag { color: #e06c75; }
      .hljs-name { color: #e06c75; }
      .hljs-variable { color: #e06c75; }
      .hljs-template-variable { color: #e06c75; }
      .hljs-regexp { color: #98c379; }
      .hljs-link { color: #98c379; }
      .hljs-symbol { color: #61afef; }
      .hljs-bullet { color: #61afef; }
      .hljs-deletion { color: #e06c75; }
      .hljs-addition { color: #98c379; }
      .hljs-section { color: #61afef; }
    `
  }

  render(): void {
    const lang = (this.getAttribute('lang') || 'CODE').toUpperCase()

    this.shadowRoot?.setHTMLUnsafe(/* html */ `
      <style>${CodeSnippetElement.styles}</style>
      <div class="wrapper">
        <div class="header">
          <span class="lang">${lang}</span>
        </div>
        <pre><code><slot></slot></code></pre>
      </div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.CodeSnippetElement = CodeSnippetElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
