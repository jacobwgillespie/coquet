export function isTag(value: React.ElementType): value is keyof JSX.IntrinsicElements {
  return typeof value === 'string'
}

export function getComponentName(value: React.ElementType): string {
  if (isTag(value)) {
    return value
  }
  return value.displayName || value.name || 'Component'
}

export function generateDisplayName(value: React.ElementType) {
  return isTag(value) ? `styled.${value}` : `Styled(${getComponentName(value)})`
}

const escapeMiddle = /[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~-]+/g
const escapeEnd = /(^-|-$)/g

export function cssEscape(value: string) {
  return value.replace(escapeMiddle, '-').replace(escapeEnd, '')
}
