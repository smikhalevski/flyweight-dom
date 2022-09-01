import { Node } from './Node';
import { Element } from './Element';
import { NodeType } from './NodeType';
import { DocumentFragment } from './DocumentFragment';

export interface PropertyDescriptor<T, V> {
  configurable?: boolean;
  enumerable?: boolean;
  value?: V;
  writable?: boolean;

  get?(this: T): V;

  set?(this: T, value: V): void;
}

export type Constructor<T = any> = new (...args: any[]) => T;

export const defineProperty: <T, P extends keyof T>(object: T, key: P, descriptor: PropertyDescriptor<T, T[P]>) => T =
  Object.defineProperty;

export function extendClass<T>(constructor: Constructor<T>, baseConstructor: Constructor<any>): T {
  const prototype = Object.create(baseConstructor.prototype);
  constructor.prototype = prototype;
  prototype.constructor = constructor;
  return prototype;
}

export function die(message: string): never {
  throw new Error(message);
}

export function isElement(node: Node): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE;
}
