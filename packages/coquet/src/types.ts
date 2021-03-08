export type Interpolation = string | React.ComponentType | ((ctx: object) => Interpolation) | Interpolation[]

export type Styles = string[] | object | ((ctx: object) => Interpolation)
