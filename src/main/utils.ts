import { Node } from './Node';
import { Element } from './Element';
import { DocumentFragment } from './DocumentFragment';

export const enum NodeConstants {
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

export const enum NodeFilterConstants {
  FILTER_ACCEPT = 1,
  FILTER_REJECT = 2,
  FILTER_SKIP = 3,
  SHOW_ALL = 0xffffffff,
  SHOW_ATTRIBUTE = 2,
  SHOW_CDATA_SECTION = 8,
  SHOW_COMMENT = 128,
  SHOW_DOCUMENT = 256,
  SHOW_DOCUMENT_FRAGMENT = 1024,
  SHOW_DOCUMENT_TYPE = 512,
  SHOW_ELEMENT = 1,
  SHOW_PROCESSING_INSTRUCTION = 64,
  SHOW_TEXT = 4,
}

export type Constructor<T = any> = new (...args: any[]) => T;

export interface TypedPropertyDescriptor<T, V> {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;

  get?(this: T): V;

  set?(this: T, value: V): void;
}

export type TypedPropertyDescriptorMap<T> = { [K in keyof T]?: TypedPropertyDescriptor<T, T[K]> };

/**
 * `extendClass` is used instead of `extends` syntax to avoid excessive super constructor calls and speed up
 * instantiation.
 */
export function extendClass<T>(
  constructor: Constructor<T>,
  superConstructor: Constructor,
  properties?: TypedPropertyDescriptorMap<T>
): T {
  const Super = class {
    constructor() {
      this.constructor = constructor;
    }
  };

  Super.prototype = superConstructor.prototype;

  Object.setPrototypeOf(constructor, superConstructor);

  constructor.prototype = new Super();

  if (properties !== undefined) {
    Object.defineProperties(constructor.prototype, properties as PropertyDescriptorMap);
  }

  return constructor.prototype;
}

export function die(message: string): never {
  throw new Error(message);
}

export function isElement(node: Node): node is Element {
  return node.nodeType === NodeConstants.ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === NodeConstants.DOCUMENT_FRAGMENT_NODE;
}

export function getPreviousSiblingOrSelf(node: Node | null, nodeType: NodeConstants): Node | null {
  while (node !== null && node.nodeType !== nodeType) {
    node = node.previousSibling;
  }
  return node;
}

export function getNextSiblingOrSelf(node: Node | null, nodeType: NodeConstants): Node | null {
  while (node !== null && node.nodeType !== nodeType) {
    node = node.nextSibling;
  }
  return node;
}

// https://www.w3.org/TR/2009/WD-html5-20090212/infrastructure.html#space-character
export function isSpaceChar(charCode: number): boolean {
  return charCode === 32 || charCode === 9 || charCode === 10 || charCode === 12 || charCode === 13;
}

export function isEqualConstructor<T extends Node>(node: T, otherNode: Node | null | undefined): otherNode is T {
  return otherNode !== null && otherNode !== undefined && otherNode.constructor === node.constructor;
}

export function isEqualChildNodes(node: Node, otherNode: Node): boolean {
  let child = node.firstChild;
  let otherChild = otherNode.firstChild;

  while (child !== null && otherNode !== null && child.isEqualNode(otherChild)) {
    child = child.nextSibling;
    otherChild = otherNode.nextSibling;
  }
  return child === null && otherChild === null;
}
