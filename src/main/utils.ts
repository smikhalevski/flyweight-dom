import type { ChildNode } from './ChildNode.js';
import type { DocumentFragment } from './DocumentFragment.js';
import type { Element } from './Element.js';
import type { Node } from './Node.js';
import type { Text } from './Text.js';

export const ELEMENT_NODE: number = 1;
export const ATTRIBUTE_NODE: number = 2;
export const TEXT_NODE: number = 3;
export const CDATA_SECTION_NODE: number = 4;
export const PROCESSING_INSTRUCTION_NODE: number = 7;
export const COMMENT_NODE: number = 8;
export const DOCUMENT_NODE: number = 9;
export const DOCUMENT_TYPE_NODE: number = 10;
export const DOCUMENT_FRAGMENT_NODE: number = 11;

export function isElement(node: Node): node is Element {
  return node.nodeType === ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === DOCUMENT_FRAGMENT_NODE;
}

export function getPreviousSiblingOrSelf(node: Node | null, nodeType: number): Node | null {
  while (node !== null && node.nodeType !== nodeType) {
    node = node.previousSibling;
  }
  return node;
}

export function getNextSiblingOrSelf(node: Node | null, nodeType: number): Node | null {
  while (node !== null && node.nodeType !== nodeType) {
    node = node.nextSibling;
  }
  return node;
}

/**
 * Returns the node or its first following sibling that isn't one of the given nodes.
 *
 * @see [Viable next sibling](https://dom.spec.whatwg.org/#dom-childnode-after)
 */
export function getViableNextSibling(node: ChildNode | null, nodes: ArrayLike<unknown>): ChildNode | null {
  while (node !== null && Array.prototype.indexOf.call(nodes, node) !== -1) {
    node = node.nextSibling;
  }
  return node;
}

export function isText(node: Node): node is Text {
  return node.nodeType === TEXT_NODE || node.nodeType === CDATA_SECTION_NODE;
}

export function assertOffset(data: string, offset: number): void {
  if (offset < 0 || offset > data.length) {
    throw new Error('The offset ' + offset + ' is out of range');
  }
}

/**
 * Converts a count the same way browsers convert unsigned long arguments, so a negative count spans to the end of
 * the data, and NaN becomes 0.
 */
export function toUnsignedLong(count: number): number {
  return count >>> 0;
}

// https://infra.spec.whatwg.org/#ascii-whitespace
export function isSpaceChar(charCode: number): boolean {
  return (
    charCode === /* \s */ 32 ||
    charCode === /* \n */ 10 ||
    charCode === /* \t */ 9 ||
    charCode === /* \r */ 13 ||
    charCode === /* \f */ 12
  );
}

export function isEqualConstructor<T extends Node>(node: T, otherNode: Node | null | undefined): otherNode is T {
  return otherNode !== null && otherNode !== undefined && otherNode.constructor === node.constructor;
}

export function isEqualChildNodes(node: Node, otherNode: Node): boolean {
  let child = node.firstChild;
  let otherChild = otherNode.firstChild;

  while (child !== null && otherChild !== null && child.isEqualNode(otherChild)) {
    child = child.nextSibling;
    otherChild = otherChild.nextSibling;
  }

  return child === null && otherChild === null;
}
