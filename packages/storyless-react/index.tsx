"use client";
import { forwardRef } from "react";
import * as storyless from "./Storyless";

let BUNDLE_STORYLESS =
  process.env.NODE_ENV !== "development" ||
  process.env.BUNDLE_STORYLESS === "true" ||
  process.env.NEXT_PUBLIC_BUNDLE_STORYLESS === "true" ||
  process.env.REACT_APP_BUNDLE_STORYLESS === "true";

try {
  const importMetaBundle =
    // @ts-ignore
    (import.meta?.["env"]?.VITE_BUNDLE_STORYLESS ?? "false") === "true";
  if (importMetaBundle) BUNDLE_STORYLESS = true;
} catch (e) {}

export const Storyless: (typeof storyless)["Storyless"] = BUNDLE_STORYLESS
  ? forwardRef(function () {
      return null;
    })
  : storyless.Storyless;
