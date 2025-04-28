import { Node } from './Node';
import { Element } from './Element';
import { DocumentFragment } from './DocumentFragment';
import { ParentNode } from './ParentNode';
import { uncheckedRemoveChild } from './uncheckedRemoveChild';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { Text } from './Text';

/**
 * @group Other
 */
export type Constructor<T = any> = new (...args: any[]) => T;

/**
 * @group Other
 */
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

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

  return child == null && otherChild == null;
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
