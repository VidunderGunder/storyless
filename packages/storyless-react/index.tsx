"use client";
import { forwardRef } from "react";
import * as storyless from "./Storyless";

let BUNDLE_STORYLESS =
  process.env.NODE_ENV !== "development" ||
  process.env.BUNDLE_STORYLESS === "true" ||
  process.env.NEXT_PUBLIC_BUNDLE_STORYLESS === "true" ||
  process.env.REACT_APP_BUNDLE_STORYLESS === "true";

export const Storyless: (typeof storyless)["Storyless"] = BUNDLE_STORYLESS
  ? forwardRef(function () {
      return null;
    })
  : storyless.Storyless;
