"use client";
import { forwardRef } from "react";
import * as storyless from "./Storyless";
import * as icon from "./Icon";

export const Storyless: (typeof storyless)["Storyless"] =
  process.env.NODE_ENV !== "development"
    ? forwardRef(function () {
        return null;
      })
    : storyless.Storyless;

export const Icon: (typeof icon)["Icon"] =
  process.env.NODE_ENV !== "development"
    ? forwardRef(function () {
        return null;
      })
    : icon.Icon;
