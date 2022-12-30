import { Node } from './Node';
import { Element } from './Element';
import { NodeType } from './NodeType';
import { DocumentFragment } from './DocumentFragment';

export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * `extendClass` is used instead of `extends` syntax to avoid excessive super constructor calls and speed up
 * instantiation.
 */
export function extendClass<T>(constructor: Constructor<T>, superConstructor: Constructor): T {
  Object.assign(constructor, superConstructor);

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

export function getPreviousSiblingOrSelf(node: Node | null, nodeType: NodeType): Element | null {
  while (node != null && node.nodeType !== nodeType) {
    node = node.previousSibling;
  }
  return node as Element | null;
}

export function getNextSiblingOrSelf(node: Node | null, nodeType: NodeType): Element | null {
  while (node != null && node.nodeType !== nodeType) {
    node = node.nextSibling;
  }
  return node as Element | null;
}

// https://www.w3.org/TR/2009/WD-html5-20090212/infrastructure.html#space-character
export function isSpaceChar(charCode: number): boolean {
  return charCode === 32 || charCode === 9 || charCode === 10 || charCode === 12 || charCode === 13;
}

export function isEqualConstructor<T extends Node>(node: T, otherNode: Node | null | undefined): otherNode is T {
  return otherNode != null && otherNode.constructor === node.constructor;
}

export function isEqualChildNodes(node: Node, otherNode: Node): boolean {
  let child = node.firstChild;
  let otherChild = otherNode.firstChild;

  while (child != null && otherNode != null && child.isEqualNode(otherChild)) {
    child = child.nextSibling;
    otherChild = otherNode.nextSibling;
  }
  return child === null && otherChild === null;
}
