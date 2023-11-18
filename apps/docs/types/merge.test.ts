import {
  ChillIntersection,
  CombineOptionalTypes,
  CombineRequiredTypes,
  DifferingTypeKeys,
  OmittableKeys,
  OptionalUnionKeys,
  OptionalEitherKeys,
  RequiredUnionKeys,
  SharedKeys,
} from "./merge";

type TypeOne = {
  color: string;
  disabled?: boolean | undefined;
  loading: boolean | undefined;
};

type TypeTwo = {
  color: string;
  count: number;
  disabled?: boolean | undefined | null;
  loading?: boolean | undefined | null;
};

type Shared = SharedKeys<TypeOne, TypeTwo>;
type Omittable = OmittableKeys<TypeOne, TypeTwo>;
type OptionalEither = OptionalEitherKeys<TypeOne, TypeTwo>;
type OptionalBoth = OptionalUnionKeys<TypeOne, TypeTwo>;
type RequiredUnion = RequiredUnionKeys<TypeOne, TypeTwo>;
type Differing = DifferingTypeKeys<TypeOne, TypeTwo>;

type CombineRequired = CombineRequiredTypes<TypeOne, TypeTwo>;
type CombineOptional = CombineOptionalTypes<TypeOne, TypeTwo>;

type WantedMergedType = {
  color: string;
  disabled?: boolean | undefined;
  loading: boolean | undefined;
};
const wantedMerged: WantedMergedType = {
  color: "pink",
  loading: undefined,
};

type MergedType = ChillIntersection<TypeTwo, TypeOne>;
const merged: MergedType = {
  color: "pink",
  loading: undefined,
};

describe("merge", () => {
  /**
   * No runtime tests actually needed, but we want to make sure the types are correct
   *
   * Most likely redundant to run this, but we want this file for testing purposes until we have a better way of testing types
   */
  it("should work", () => {
    expect(merged).toEqual(wantedMerged);
  });
});
