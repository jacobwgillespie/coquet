import {v3} from 'murmurhash'

export function generateComponentID(string: string) {
  return v3(string).toString(36)
}
