"use client";
import React from "react";
import * as storyless from "./storyless";
import * as combinations from "./combinations";

export const Storyless: (typeof storyless)["Storyless"] =
  process.env.NODE_ENV !== "development"
    ? // eslint-disable-next-line -- Hack to prevent the storyless component from being included in the production bundle
      React.forwardRef(function () {
        return null;
      })
    : storyless.Storyless;

export const Combinations: (typeof combinations)["Combinations"] =
  process.env.NODE_ENV !== "development"
    ? // eslint-disable-next-line -- Hack to prevent the combinations component from being included in the production bundle
      function () {
        return null;
      }
    : combinations.Combinations;
