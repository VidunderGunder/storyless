"use client";
import { forwardRef } from "react";
import * as storyless from "./storyless";

export const Storyless: (typeof storyless)["Storyless"] =
  process.env.NODE_ENV !== "development"
    ? // eslint-disable-next-line -- This is a hack to prevent the storyless component from being included in the production bundle
      forwardRef(function () {
        return null;
      })
    : storyless.Storyless;
