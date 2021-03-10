import {createContext, useContext} from 'react'
import {StyleManager} from './internal/StyleManager'
import {DOMStyleSheet, VirtualStyleSheet} from './internal/StyleSheet'

export const StyleSheetContext = createContext<StyleManager | undefined>(undefined)

const isBrowser = typeof document !== 'undefined'
export const globalStyleSheet = new StyleManager(isBrowser ? new DOMStyleSheet() : new VirtualStyleSheet())

export function useStyleSheet(): StyleManager {
  return useContext(StyleSheetContext) ?? globalStyleSheet
}

export const CoquetProvider = () => {}
