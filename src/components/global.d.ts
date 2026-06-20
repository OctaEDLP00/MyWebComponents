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
  CustomSelectElement,
  AvatarGroupElement,
  CollapsibleAccordionElement,
  CopyButtonElement,
  ProgressRingElement,
  ManagerToastElement,
  CodeSnippetElement,
  SegmentControlElement,
  ComponentCatalogElement,
  CatalogCardElement,
  CatalogModalElement,
  FloatingInputElement,
  TimelineItemElement,
  VisualDividerElement,
} from './index.ts'

declare global {
  type OS = 'mac' | 'linux' | 'windows' | 'android' | 'ios' | 'unknown'

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
    CustomSelectElement: typeof CustomSelectElement
    AvatarGroupElement: typeof AvatarGroupElement
    CollapsibleAccordionElement: typeof CollapsibleAccordionElement
    CopyButtonElement: typeof CopyButtonElement
    ProgressRingElement: typeof ProgressRingElement
    ManagerToastElement: typeof ManagerToastElement
    CodeSnippetElement: typeof CodeSnippetElement
    SegmentControlElement: typeof SegmentControlElement
    ComponentCatalogElement: typeof ComponentCatalogElement
    CatalogCardElement: typeof CatalogCardElement
    CatalogModalElement: typeof CatalogModalElement
    //skeletons
    FloatingInputElement: typeof FloatingInputElement
    TimelineItemElement: typeof TimelineItemElement
    VisualDividerElement: typeof VisualDividerElement
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
    'key-shortcut': KeyShortcutElement
    'custom-select': CustomSelectElement
    'avatar-group': AvatarGroupElement
    'collapsible-accordion': CollapsibleAccordionElement
    'copy-button': CopyButtonElement
    'progress-ring': ProgressRingElement
    'toast-manager': ManagerToastElement
    'code-snippet': CodeSnippetElement
    'segmented-control': SegmentControlElement
    'component-catalog': ComponentCatalogElement
    'component-catalog-card': CatalogCardElement
    'component-catalog-modal': CatalogModalElement
    'floating-input': FloatingInputElement
    'timeline-item': TimelineItemElement
    'visual-divider': VisualDividerElement
  }
}

export {}
