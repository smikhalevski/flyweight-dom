import type { Node } from './Node.js';
import type { Element } from './Element.js';
import type { DocumentFragment } from './DocumentFragment.js';

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

// https://www.w3.org/TR/xml/#NT-S
export function isSpaceChar(charCode: number): boolean {
  return charCode == /* \s */ 32 || charCode === /* \n */ 10 || charCode === /* \t */ 9 || charCode === /* \r */ 13;
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
