import { Node } from './Node';
import { Element } from './Element';
import { DocumentFragment } from './DocumentFragment';

export const CHILDREN = Symbol('children');
export const CHILD_NODES = Symbol('childNodes');

export const enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
}

export type Constructor<T = any> = new (...args: any[]) => T;

interface TypedPropertyDescriptor<T, V> {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;

  get?(this: T): V;

  set?(this: T, value: V): void;
}

type TypedPropertyDescriptorMap<T> = { [K in keyof T]?: TypedPropertyDescriptor<T, T[K]> };

/**
 * `extendClass` is used instead of `extends` syntax to avoid excessive super constructor calls and speed up
 * instantiation.
 */
export function extendClass<T>(
  constructor: Constructor<T>,
  superConstructor: Constructor,
  properties?: TypedPropertyDescriptorMap<T>
): T {
  Object.setPrototypeOf(constructor, superConstructor);

  const prototype = Object.create(superConstructor.prototype, properties as PropertyDescriptorMap);
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
