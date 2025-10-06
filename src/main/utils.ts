import { Node } from './Node.js';
import { Element } from './Element.js';
import { DocumentFragment } from './DocumentFragment.js';
import { ParentNode } from './ParentNode.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { uncheckedAppendChild } from './uncheckedAppendChild.js';
import { Text } from './Text.js';

export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
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

export function setTextContent(node: ParentNode, value: string | null): void {
  while (node.firstChild !== null) {
    uncheckedRemoveChild(node, node.firstChild);
  }

  if (value !== null && value.length !== 0) {
    uncheckedAppendChild(node, new Text(value));
  }
}

export function getTextContent(node: Node): string {
  let value = '';

  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    value += child.textContent;
  }

  return value;
}
