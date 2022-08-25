export const { defineProperty, create: createPrototype, is: isEqual } = Object;

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function die(message?: string): never {
  throw new Error(message);
}
