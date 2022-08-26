import { Node } from './Node';
import { Attr } from './Attr';
import { extendContainer } from './extendContainer';
import { uncheckedCloneChildNodes } from './node-utils';
import { createPrototype, defineProperty, isString } from './utils';
import { NamedNodeMap } from './NamedNodeMap';
import { NodeType } from './NodeType';
import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';

export interface Element extends Node, ChildNode, NonDocumentTypeChildNode, ParentNode {
  // readonly rawAttributes: { [name: string]: string };
  // readonly attributes: NamedNodeMap;
  //
  // className: string;
  // id: string;
  //
  // getAttribute(name: string): string | null;
  //
  // getAttributeNames(): string[];
  //
  // getAttributeNode(name: string): Attr | null;
  //
  // hasAttribute(name: string): boolean;
  //
  // hasAttributes(): boolean;
  //
  // removeAttribute(name: string): void;
  //
  // removeAttributeNode(attr: Attr): Attr;
  //
  // setAttribute(name: string, value: string): void;
  //
  // setAttributeNode(attr: Attr): Attr | null;
}

export class Element {
  constructor(readonly tagName: string) {
    Node.call(this, NodeType.ELEMENT_NODE, tagName);
  }
}

const prototype: Element = (Element.prototype = createPrototype(Node.prototype));

extendContainer(prototype);

prototype.cloneNode = function (deep?: boolean): Node {
  const node = new Element(this.tagName);
  if (deep) {
    uncheckedCloneChildNodes(this, node);
  }
  return node;
};
