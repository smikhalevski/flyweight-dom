import { Node } from './Node';
import { Element } from './Element';
import { NodeType } from './NodeType';
import { DocumentFragment } from './DocumentFragment';

export type Constructor<T = any> = new (...args: any[]) => T;

export function extendClass<T>(constructor: Constructor<T>, superConstructor: Constructor): T {
  const prototype = Object.create(superConstructor.prototype);
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

export function getPreviousElementSibling(node: Node | null): Element | null {
  while (node !== null && node.nodeType !== NodeType.ELEMENT_NODE) {
    node = node.previousSibling;
  }
  return node as Element | null;
}

export function getNextElementSibling(node: Node | null): Element | null {
  while (node !== null && node.nodeType !== NodeType.ELEMENT_NODE) {
    node = node.nextSibling;
  }
  return node as Element | null;
}
