export function isPresent<T>(t: T | undefined | null | void): t is T {
  return t !== undefined && t !== null;
}

export const copyJSON = <T>(json: T): T => JSON.parse(JSON.stringify(json));
