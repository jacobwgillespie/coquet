import {v3} from 'murmurhash'

export function hash(string: string) {
  return v3(string).toString(36)
}
