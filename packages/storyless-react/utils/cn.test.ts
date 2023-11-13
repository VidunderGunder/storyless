import { describe, it, expect } from "bun:test";
import { cn } from "./cn";

describe("cn", () => {
  it("should return a string", () => {
    expect(typeof cn("whatever")).toBe("string");
  });
  it("should combine classes as expected", () => {
    expect(cn("class1")).toBe("class1");
    expect(cn("class1", "class2")).toBe("class1 class2");
    expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3");
  });
  it("should ignore undefined classes", () => {
    expect(cn("class1", undefined)).toBe("class1");
    expect(cn(undefined, "class2")).toBe("class2");
    expect(cn(undefined, undefined)).toBe("");
  });
  it("should ignore empty strings", () => {
    expect(cn("class1", "")).toBe("class1");
    expect(cn("", "class2")).toBe("class2");
    expect(cn("", "")).toBe("");
  });
  it("should return an empty string if no classes are provided", () => {
    expect(cn()).toBe("");
  });
});
