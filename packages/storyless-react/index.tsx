"use client";
import { forwardRef } from "react";
import * as storyless from "./Storyless";

export const Storyless: (typeof storyless)["Storyless"] =
  process.env.NODE_ENV !== "development"
    ? forwardRef(function () {
        return null;
      })
    : storyless.Storyless;
