export class PreviewIframeElement extends HTMLElement {
  static readonly ZOOM_STEP = 0.1
  static readonly MIN_ZOOM = 0.1
  static readonly MAX_ZOOM = 5.0
  static readonly ZOOM_SNAP = 0.05

  private iframe: HTMLIFrameElement | null | undefined
  private zoomInBtn: HTMLButtonElement | null | undefined
  private zoomOutBtn: HTMLButtonElement | null | undefined
  private zoomResetBtn: HTMLButtonElement | null | undefined
  private fullscreenBtn: HTMLButtonElement | null | undefined
  private controls: HTMLDivElement | null | undefined
  private zoomDisplay: HTMLDivElement | null | undefined
  private observer: IntersectionObserver | null | undefined = null
  private isContentLoaded = false
  private currentZoom = 1.0
  private boundKeydownHandler: ((e: KeyboardEvent) => void) | null = null
  private boundWheelHandler: ((e: WheelEvent) => void) | null = null

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.render()
  }

  static define(tag = 'preview-iframe', registry = customElements) {
    if (!registry.get(tag)) {
      registry.define(tag, this)
    }
    return this
  }

  private setupElements() {
    if (!this.shadowRoot) return
    this.iframe = this.shadowRoot.querySelector('iframe')
    this.zoomInBtn = this.shadowRoot.querySelector('.zoom-in')
    this.zoomOutBtn = this.shadowRoot.querySelector('.zoom-out')
    this.zoomResetBtn = this.shadowRoot.querySelector('.zoom-reset')
    this.fullscreenBtn = this.shadowRoot.querySelector('.fullscreen')
    this.controls = this.shadowRoot.querySelector('.controls')
    this.zoomDisplay = this.shadowRoot.querySelector('.zoom-display')

    // Configuración inicial
    if (this.hasAttribute('show-controls')) {
      if (this.controls == null) return
      this.controls.style.opacity = this.getAttribute('show-controls') === 'true' ? '1' : '0'
    }

    if (this.hasAttribute('show-zoom-level')) {
      if (this.zoomDisplay == null) return
      this.zoomDisplay.style.display = this.getAttribute('show-zoom-level') === 'true' ? 'block' : 'none'
    }
  }

  private setupEvents() {
    if (this.zoomInBtn == null) return
    this.zoomInBtn.addEventListener('click', () => this.adjustZoom(PreviewIframeElement.ZOOM_STEP))
    if (this.zoomOutBtn == null) return
    this.zoomOutBtn.addEventListener('click', () => this.adjustZoom(-PreviewIframeElement.ZOOM_STEP))
    if (this.zoomResetBtn == null) return
    this.zoomResetBtn.addEventListener('click', () => this.resetZoom())
    if (this.fullscreenBtn == null) return
    this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen())

    if (this.controls == null) return
    this.controls.addEventListener('mouseenter', () => {
      if (this.controls == null) return
      this.controls.style.opacity = '1'
    })

    this.controls.addEventListener('mouseleave', () => {
      if (this.getAttribute('show-controls') !== 'true') {
        if (this.controls == null) return
        this.controls.style.opacity = '0'
      }
    })

    if (this.iframe == null) return
    this.iframe.addEventListener('load', this.onIframeLoad.bind(this))
    this.iframe.addEventListener('error', this.onIframeError.bind(this))

    this.boundKeydownHandler = this.handleKeydown.bind(this)
    this.addEventListener('keydown', this.boundKeydownHandler)

    this.boundWheelHandler = this.handleWheel.bind(this)
    this.addEventListener('wheel', this.boundWheelHandler, { passive: false })
  }

  private onIframeLoad() {
    this.isContentLoaded = true
    this.hideLoader()
    this.dispatchEvent(new CustomEvent('preview-loaded', { bubbles: true, composed: true }))
  }

  private onIframeError() {
    if (this.shadowRoot == null) return
    const errorMessage = this.shadowRoot.querySelector('.error-message') as HTMLDivElement | null
    if (errorMessage == null) return
    errorMessage.textContent = 'Error loading content'
    errorMessage.style.display = 'block'
    this.hideLoader()
    this.dispatchEvent(new CustomEvent('preview-error', { bubbles: true, composed: true }))
  }

  private setupIntersectionObserver() {
    if (this.getAttribute('loading') !== 'lazy') return

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isContentLoaded) {
          const src = this.getAttribute('src')
          if (src) {
            if (this.iframe == null) return
            this.showLoader()
            this.iframe.src = src
          }
          if (!this.observer) return
          this.observer.disconnect()
        }
      })
    })

    this.observer.observe(this)
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!e.ctrlKey && !e.metaKey) return

    switch (e.key) {
      case '=':
      case '+':
        e.preventDefault()
        this.adjustZoom(PreviewIframeElement.ZOOM_STEP)
        break
      case '-':
      case '_':
        e.preventDefault()
        this.adjustZoom(-PreviewIframeElement.ZOOM_STEP)
        break
      case '0':
        e.preventDefault()
        this.resetZoom()
        break
    }
  }

  private handleWheel(e: WheelEvent) {
    if (!e.ctrlKey && !e.metaKey) return

    e.preventDefault()
    const delta = e.deltaY > 0 ? -PreviewIframeElement.ZOOM_STEP : PreviewIframeElement.ZOOM_STEP
    this.adjustZoom(delta)
  }

  private setInitialZoom() {
    const initialZoom = parseFloat(this.getAttribute('initial-zoom') ?? '') || 1.0
    this.currentZoom = initialZoom
    this.applyZoom()
  }

  /**
   * Apply zoom transformation to iframe
   */
  private applyZoom() {
    // console.log(this.#currentZoom)
    if (this.iframe == null) return
    this.iframe.style.transform = `scale(${this.currentZoom})`
    this.updateZoomDisplay()
  }

  private updateZoomDisplay() {
    if (this.zoomDisplay) {
      this.zoomDisplay.textContent = `${Math.round(this.currentZoom * 100)}%`
    }
  }

  private adjustZoom(delta: number) {
    const next =
      Math.round((this.currentZoom + delta) / PreviewIframeElement.ZOOM_SNAP) * PreviewIframeElement.ZOOM_SNAP
    this.currentZoom = Math.max(PreviewIframeElement.MIN_ZOOM, Math.min(PreviewIframeElement.MAX_ZOOM, next))
    this.applyZoom()
    this.dispatchZoomEvent()
  }

  private resetZoom() {
    this.currentZoom = 1.0
    this.applyZoom()
    this.dispatchZoomEvent()
  }

  private dispatchZoomEvent() {
    this.dispatchEvent(
      new CustomEvent('zoom-changed', {
        detail: { zoomLevel: this.currentZoom },
        bubbles: true,
        composed: true,
      }),
    )
  }

  private async toggleFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await this.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('Fullscreen error:', err)
    }
  }

  private showLoader() {
    if (this.shadowRoot == null) return
    const loader = this.shadowRoot.querySelector('.loader') as HTMLElement | null
    if (loader) loader.style.display = 'block'
  }

  private hideLoader() {
    if (this.shadowRoot == null) return
    const loader = this.shadowRoot.querySelector('.loader') as HTMLElement | null
    if (loader) loader.style.display = 'none'
  }

  setContent(content: string) {
    this.showLoader()
    if (this.iframe == null) return
    this.iframe.srcdoc = content
  }

  setSandboxAttributes() {
    const sandbox = this.getAttribute('sandbox')
    const allow = this.getAttribute('allow')

    if (sandbox && this.iframe) {
      this.iframe.sandbox.value = sandbox
    }

    if (allow && this.iframe) {
      this.iframe.allow = allow
    }
  }

  static get observedAttributes() {
    return ['allow', 'height', 'initial-zoom', 'loading', 'sandbox', 'show-controls', 'show-zoom-level', 'src', 'width']
  }

  static get styles() {
    return /* css */ `
      :host {
        color-scheme: light dark;
        --bg-color-light: #f8f9fa;
        --bg-color-dark: #131313;
        display: block;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
      }

      :host(:focus) {
        outline: 2px solid Highlight;
        outline: 2px solid -webkit-focus-ring-color;
      }

      .container {
        position: relative;
        width: 100%;
        height: 100%;
      }

      iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: light-dark(var(--bg-color-light), var(--bg-color-dark));
      }

      .controls {
        position: absolute;
        bottom: 10px;
        right: 10px;
        display: flex;
        gap: 5px;
        z-index: 10;
      }

      .controls button {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      button {
        background: rgba(0,0,0,0.7);
        color: white;
        border: none;
        border-radius: 3px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 14px;
      }

      button:hover {
        background: rgba(0, 0, 0, 0.2);
      }

      .zoom-display {
        color: white;
        padding: 0 8px;
        font-size: 12px;
        min-width: 40px;
        text-align: center;
      }

      .loader {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 2s linear infinite;
        z-index: 5;
      }

      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }

      .error-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #e80e0e;
        text-align: center;
        z-index: 5;
      }

      @media (width < 300px) {
        .controls {
          flex-direction: column;
        }
      }
    `
  }

  connectedCallback() {
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0')
    }
    this.setupElements()
    this.setupEvents()
    this.setupIntersectionObserver()
    this.setSandboxAttributes()
    this.setInitialZoom()
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect()
    }
    if (this.iframe) {
      this.iframe.removeEventListener('load', this.onIframeLoad)
      this.iframe.removeEventListener('error', this.onIframeError)
    }
    if (this.boundKeydownHandler) {
      this.removeEventListener('keydown', this.boundKeydownHandler)
    }
    if (this.boundWheelHandler) {
      this.removeEventListener('wheel', this.boundWheelHandler)
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return

    switch (name) {
      case 'src':
        if (newValue && this.getAttribute('loading') !== 'lazy') {
          this.showLoader()
          if (this.iframe == null) return
          this.iframe.src = newValue
        }
        break
      case 'width':
      case 'height':
        if (!newValue) return
        this.style[name] = newValue.endsWith('px') ? newValue : `${newValue}px`
        break
      case 'sandbox':
      case 'allow':
        this.setSandboxAttributes()
        break
      case 'show-controls':
        if (this.controls) {
          this.controls.style.opacity = newValue === 'true' ? '1' : '0'
        }
        break
      case 'initial-zoom':
        this.setInitialZoom()
        break
      case 'show-zoom-level':
        if (this.zoomDisplay) {
          this.zoomDisplay.style.display = newValue === 'true' ? 'block' : 'none'
        }
        break
    }
  }

  render() {
    if (this.shadowRoot == null) return
    this.shadowRoot.setHTMLUnsafe(/* html */ `
      <style>${PreviewIframeElement.styles}</style>
      <div class="container">
        <div class="loader" style="display: none;"></div>
        <div class="error-message" style="display: none;"></div>
        <iframe loading="${this.getAttribute('loading') || 'lazy'}"></iframe>
        <div class="controls">
          <div class="zoom-display" style="display: ${this.hasAttribute('show-zoom-level') ? 'block' : 'none'}">100%</div>
          <button class='zoom-reset' title="Reset zoom (Ctrl+0)" aria-label="Reset zoom">
            <svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true'>
              <use href='#zoom-reset'></use>
            </svg>
          </button>
          <button class='zoom-out' title="Zoom out (Ctrl+-)" aria-label="Zoom out">
            <svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true'>
              <use href='#zoom-out'></use>
            </svg>
          </button>
          <button class='zoom-in' title="Zoom in (Ctrl++)" aria-label="Zoom in">
            <svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true'>
              <use href='#zoom-in'></use>
            </svg>
          </button>
          <button class='fullscreen' title="Fullscreen" aria-label="Toggle fullscreen">
            <svg width='20' height='20' viewBox='0 0 24 24' aria-hidden='true'>
              <use href='#fullscreen'></use>
            </svg>
          </button>
        </div>
      </div>
      <div hidden class='svg-sprite-container'>
        <svg xmlns='http://www.w3.org/2000/svg'>
          <symbol id='zoom-in' viewBox='0 0 24 24'>
            <circle cx='11' cy='11' r='7' fill='none' stroke='currentColor' stroke-width='1.5'/>
            <path d='M11 8v6M8 11h6' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>
            <path d='M16 16l5 5' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>
          </symbol>
          <symbol id='zoom-out' viewBox='0 0 24 24'>
            <circle cx='11' cy='11' r='7' fill='none' stroke='currentColor' stroke-width='1.5'/>
            <path d='M8 11h6' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>
            <path d='M16 16l5 5' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>
          </symbol>
          <symbol id='zoom-reset' viewBox='0 0 24 24'>
            <path d='M3 12a9 9 0 1 0 9-9M3 3v5h5' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/>
          </symbol>
          <symbol id='fullscreen' viewBox='0 0 24 24'>
            <path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2'/>
          </symbol>
        </svg>
      </div>
    `)
  }
}

const root = (typeof globalThis !== 'undefined' ? globalThis : window) as typeof window

try {
  root.PreviewIframeElement = PreviewIframeElement.define()
} catch (e: unknown) {
  if (
    !(root.DOMException && e instanceof DOMException && e.name === 'NotSupportedError') &&
    !(e instanceof ReferenceError)
  ) {
    throw e
  }
}
