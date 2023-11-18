/**
 * Keys for optional values in T or U
 */
export type OptionalEitherKeys<T, U> =
  | Exclude<
      {
        [K in keyof T]: undefined extends T[K] ? K : never;
      }[keyof T],
      undefined
    >
  | Exclude<
      {
        [K in keyof U]: undefined extends U[K] ? K : never;
      }[keyof U],
      undefined
    >;

/**
 * Keys for explicitly optional values in T (not including undefined)
 */
export type OptionalExplicit<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Keys for optional values in both T or U
 */
export type OptionalUnionKeys<T, U> = OptionalExplicit<T> & OptionalExplicit<U>;

/**
 * Keys for required values in both T and U
 */
export type RequiredUnionKeys<T, U> = Exclude<
  keyof T & keyof U,
  OptionalEitherKeys<T, U>
>;

/**
 * Omits keys in U from T
 */
export type Overwrite<T, U> = Omit<T, keyof U> & U;

/**
 * Gets the keys that are in both T and U
 */
export type SharedKeys<T, U> = Extract<keyof T, keyof U>;

/**
 * Keys that are in T but not U or keys that are in U but not T
 */
export type OmittableKeys<T, U> =
  | Exclude<keyof T, keyof U>
  | Exclude<keyof U, keyof T>;

/**
 * Keys that are in T and U but have different types
 */
export type DifferingTypeKeys<T, U> = Exclude<
  {
    [K in keyof T & keyof U]: [T[K], U[K]] extends [U[K], T[K]] ? never : K;
  }[keyof T & keyof U],
  never
>;

/**
 * Combines two types T and U, using the given keys, allowing all types from both T and U
 *
 * Also ensures the resulting type is optional if either T or U is optional
 */
export type CombineRequiredTypes<T, U> = Omit<
  {
    [K in DifferingTypeKeys<T, U>]: T[K] | U[K];
  },
  OptionalUnionKeys<T, U>
>;

export type CombineOptionalTypes<T, U> = {
  [K in DifferingTypeKeys<T, U> & OptionalUnionKeys<T, U>]?: T[K] | U[K];
};

/**
 * Combines all types from keys both in T and U
 */
export type ChillIntersection<T, U> = Omit<
  Omit<U & T, OmittableKeys<T, U>>,
  DifferingTypeKeys<T, U>
> &
  CombineOptionalTypes<U, T> &
  CombineRequiredTypes<U, T>;

/**
 * Allows only matching types from keys both in T and U
 */
export type StrictIntersection<T, U> = Omit<
  T & U extends never ? never : T & U,
  OmittableKeys<T, U>
>;
