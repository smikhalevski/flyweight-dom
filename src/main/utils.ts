export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function die(message?: string): never {
  throw new Error(message);
}

export interface PropertyDescriptor<T, V> {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;

  get?(this: T): V;

  set?(this: T, value: V): void;
}

// type CreatePrototype = <T1, T2>(host: T1, properties?: { [P in keyof T2]?: PropertyDescriptor<T2, T2[P]> }) => T1 & T2;

type DefineProperty = <T, P extends keyof T>(host: T, key: P, descriptor: PropertyDescriptor<T, T[P]>) => T;

export const defineProperty: DefineProperty = Object.defineProperty;

export const createPrototype: (host: any) => any = Object.create;
