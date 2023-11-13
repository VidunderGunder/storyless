/**
 * Joins class names together, ignoring undefined values.
 *
 * Placeholder in case we want to use a library for this in the future.
 */
export function cn(...args: (string | undefined)[]): string {
  return args.filter(Boolean).join(" ");
}
