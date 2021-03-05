import {Sheet} from './sheet'

export interface CoquetContext {
  sheet: Sheet
}

export function createCoquet(): CoquetContext {
  const sheet = new Sheet({
    key: 'css',
    parent: typeof document !== 'undefined' ? document.head : ({} as any),
  })

  return {sheet}
}

export function insertRule(ctx: CoquetContext, rawRule: string) {
  try {
    ctx.sheet.insertRule(rawRule)
  } catch {}
}
