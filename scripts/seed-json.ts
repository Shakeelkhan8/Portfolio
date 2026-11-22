/**
 * The seed as JSON for the drift check. JSON.stringify drops keys whose value
 * is undefined, and the sync compares a column only when the key is present,
 * so an unset owned field would silently stop being checked. Writing null
 * keeps the key; the sync already treats undefined and null the same.
 *
 * No imports: the workflow copies this file into older checkouts.
 */
export function seedJson(seed: unknown): string {
  return JSON.stringify(seed, (_key, value: unknown) =>
    value === undefined ? null : value,
  );
}
