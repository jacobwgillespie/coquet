import {createContext, useContext} from 'react'
import {GroupStyleSheet} from './sheet/groups'
import {DOMStyleSheet, VirtualStyleSheet} from './sheet/styleSheet'

export const StyleSheetContext = createContext<GroupStyleSheet | undefined>(undefined)

const isBrowser = typeof document !== 'undefined'
export const globalStyleSheet = new GroupStyleSheet(isBrowser ? new DOMStyleSheet() : new VirtualStyleSheet())

export function useStyleSheet(): GroupStyleSheet {
  return useContext(StyleSheetContext) ?? globalStyleSheet
}

export const CoquetProvider = () => {}
