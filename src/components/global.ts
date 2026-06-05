import type {
  AlertCautionElement,
  AlertImportantElement,
  AlertNoteElement,
  AlertTipElement,
  AlertWarningElement,
  BadgeCustomElement,
  BadgeErrorElement,
  BadgeInfoElement,
  BadgeWarningElement,
  BadgeDangerElement,
  BadgeNewElement,
  BadgeBetaElement,
  BadgeUpdatedElement,
  BadgeExperimentalElement,
  BadgeGlassElement,
  BadgeDeprecatedElement,
  BadgeAlphaElement,
  BadgeSuccessElement,
  PreviewIframeElement,
  KeyShortcutElement,
} from './index.ts'

declare global {
  type Size = 'sm' | 'md' | 'lg' | 'xl'

  type Variation = 'outline' | 'soft' | 'solid'

  interface Window {
    // alerts
    AlertCautionElement: typeof AlertCautionElement
    AlertImportantElement: typeof AlertImportantElement
    AlertNoteElement: typeof AlertNoteElement
    AlertTipElement: typeof AlertTipElement
    AlertWarningElement: typeof AlertWarningElement
    // badges
    BadgeWarningElement: typeof BadgeWarningElement
    BadgeInfoElement: typeof BadgeInfoElement
    BadgeErrorElement: typeof BadgeErrorElement
    BadgeSuccessElement: typeof BadgeSuccessElement
    BadgeDangerElement: typeof BadgeDangerElement
    BadgeNewElement: typeof BadgeNewElement
    BadgeAlphaElement: typeof BadgeAlphaElement
    BadgeBetaElement: typeof BadgeBetaElement
    BadgeUpdatedElement: typeof BadgeUpdatedElement
    BadgeExperimentalElement: typeof BadgeExperimentalElement
    BadgeCustomElement: typeof BadgeCustomElement
    BadgeGlassElement: typeof BadgeGlassElement
    BadgeDeprecatedElement: typeof BadgeDeprecatedElement
    // customs
    PreviewIframeElement: typeof PreviewIframeElement
    KeyShortcutElement: typeof KeyShortcutElement
  }

  interface HTMLElementTagNameMap {
    // alerts
    'alert-caution': AlertCautionElement
    'alert-important': AlertImportantElement
    'alert-note': AlertNoteElement
    'alert-tip': AlertTipElement
    'alert-warning': AlertWarningElement
    // badges
    'badge-warning': BadgeWarningElement
    'badge-info': BadgeInfoElement
    'badge-error': BadgeErrorElement
    'badge-success': BadgeSuccessElement
    'badge-danger': BadgeDangerElement
    'badge-new': BadgeNewElement
    'badge-beta': BadgeBetaElement
    'badge-updated': BadgeUpdatedElement
    'badge-experimental': BadgeExperimentalElement
    'badge-custom': BadgeCustomElement
    'badge-glass': BadgeGlassElement
    // customs
    'preview-iframe': PreviewIframeElement
  }
}
