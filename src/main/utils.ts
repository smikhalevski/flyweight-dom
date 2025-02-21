import { Node } from './Node';
import { Element } from './Element';
import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';
import { DocumentFragment } from './DocumentFragment';

export interface InternalParentNode extends ParentNode {
  parentNode: InternalParentNode | null;
  previousSibling: InternalChildNode | null;
  nextSibling: InternalChildNode | null;
  firstChild: InternalChildNode | null;
  lastChild: InternalChildNode | null;

  cloneNode(deep?: boolean): InternalParentNode;
}

export interface InternalChildNode extends ChildNode {
  parentNode: InternalParentNode | null;
  previousSibling: InternalChildNode | null;
  nextSibling: InternalChildNode | null;
  firstChild: InternalChildNode | null;
  lastChild: InternalChildNode | null;

  cloneNode(deep?: boolean): InternalChildNode;
}

export interface InternalDocumentFragment extends DocumentFragment {
  parentNode: InternalParentNode | null;
  previousSibling: InternalChildNode | null;
  nextSibling: InternalChildNode | null;
  firstChild: InternalChildNode | null;
  lastChild: InternalChildNode | null;

  cloneNode(deep?: boolean): InternalDocumentFragment;
}

export type Constructor<T = any> = new (...args: any[]) => T;

export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;

export function die(message: string): never {
  throw new Error(message);
}

export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is InternalDocumentFragment {
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
