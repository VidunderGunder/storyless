"use client";
import { forwardRef } from "react";
import * as storyless from "./Storyless";

const BUNDLE_STORYLESS =
  process.env.BUNDLE_STORYLESS ||
  process.env.NEXT_PUBLIC_BUNDLE_STORYLESS ||
  process.env.REACT_APP_BUNDLE_STORYLESS;

export const Storyless: (typeof storyless)["Storyless"] =
  process.env.NODE_ENV !== "development" || BUNDLE_STORYLESS
    ? forwardRef(function () {
        return null;
      })
    : storyless.Storyless;
