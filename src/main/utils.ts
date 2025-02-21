import { Node } from './Node';
import { Element } from './Element';
import { ParentNode } from './ParentNode';
import { ChildNode } from './ChildNode';
import { DocumentFragment } from './DocumentFragment';

export type Constructor<T = any> = new (...args: any[]) => T;

export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

export interface MutableParentNode extends ParentNode {
  parentNode: MutableParentNode | null;
  previousSibling: MutableChildNode | null;
  nextSibling: MutableChildNode | null;
  firstChild: MutableChildNode | null;
  lastChild: MutableChildNode | null;

  cloneNode(deep?: boolean): MutableParentNode;
}

export interface MutableChildNode extends ChildNode {
  parentNode: MutableParentNode | null;
  previousSibling: MutableChildNode | null;
  nextSibling: MutableChildNode | null;
  firstChild: MutableChildNode | null;
  lastChild: MutableChildNode | null;

  cloneNode(deep?: boolean): MutableChildNode;
}

export interface MutableDocumentFragment extends DocumentFragment {
  parentNode: MutableParentNode | null;
  previousSibling: MutableChildNode | null;
  nextSibling: MutableChildNode | null;
  firstChild: MutableChildNode | null;
  lastChild: MutableChildNode | null;

  cloneNode(deep?: boolean): MutableDocumentFragment;
}

export function die(message: string): never {
  throw new Error(message);
}

export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is MutableDocumentFragment {
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
