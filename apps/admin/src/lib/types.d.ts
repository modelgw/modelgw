
export type GetDeepProp<T extends object, Key extends string> = Key extends keyof T
  ? T[Key]
  : {
    [k in keyof T]: T[k] extends object
    ? GetDeepProp<T[k], Key>
    : unknown
  }[keyof T];


export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};

export type GraphQLValidationError = {
  field?: string,
  errors: Array<string>,
}

export interface GraphQLValidationErrorExtensions extends GraphQLErrorExtensions {
  code: 'INVALID_INPUT',
  validationErrors: Array<GraphQLValidationError>,
}
