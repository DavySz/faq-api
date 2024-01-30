import type { Nullable } from '../common/types'

export interface Validation {
  validate: (input: any) => Nullable<Error>
}
