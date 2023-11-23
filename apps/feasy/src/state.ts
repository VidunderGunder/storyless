/**
 * - IMPORTANT -
 *
 * This file is for UI state management only.
 *
 * For data state management, use react-query or backend-specific state management.
 */

import { atomWithStorage } from "jotai/utils";

export const transparentNavbarAtom = atomWithStorage<boolean>(
  "feasy-transparent-navbar",
  true,
);
