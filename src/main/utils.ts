export interface PropertyDescriptor<T, V> {
  configurable?: boolean;
  enumerable?: boolean;
  value?: V;
  writable?: boolean;

  get?(this: T): V;

  set?(this: T, value: V): void;
}

export const defineProperty: <T, P extends keyof T>(object: T, key: P, descriptor: PropertyDescriptor<T, T[P]>) => T =
  Object.defineProperty;

export const createPrototype: (object: object) => any = Object.create;

export function die(message?: string): never {
  throw new Error(message);
}
