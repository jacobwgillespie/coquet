export type ClassName = string | undefined | null | false | 0 | void

export default function cx(...classNames: ClassName[]): string {
  return classNames.filter(Boolean).join(' ')
}
