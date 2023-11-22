"use client";
import React from "react";
import * as storyless from "./bundle/index.js";

export const Storyless =
  process.env.NODE_ENV !== "development"
    ? React.forwardRef(function () {
        return null;
      })
    : storyless.Storyless;

export const Combinations =
  process.env.NODE_ENV !== "development"
    ? function () {
        return null;
      }
    : storyless.Combinations;
