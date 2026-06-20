interface VirtualComponentInfo {
  file: string
  tagName: string
  className: string
  attributes: string[]
  category: string
}

interface VirtualCategoryInfo {
  name: string
  label: string
  components: VirtualComponentInfo[]
}

declare module 'virtual:component-catalog' {
  const catalog: VirtualCategoryInfo[]
  export default catalog
}
