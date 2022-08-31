import { Node } from './Node';
import { extendsContainer } from './extendsContainer';
import { extendsClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, constructChildNode, extendsChildNode } from './extendsChildNode';
import { constructParentNode, extendsParentNode, ParentNode } from './extendsParentNode';
import { uncheckedCloneContents } from './unchecked';

export interface Element extends Node, ChildNode, ParentNode {
  /*readonly*/ attributes: NamedNodeMap;

  className: string;
  id: string;

  /*private*/ _attributesMap: Map<string, string> | null;
  /*private*/ _attributeNames: string[] | null;

  setAttribute(name: string, value: string): void;

  getAttribute(name: string): string | null;

  removeAttribute(name: string): void;

  hasAttribute(name: string): boolean;

  hasAttributes(): boolean;

  getAttributeNames(): string[];

  setAttributeNode(attr: Attr): Attr | null;

  getAttributeNode(name: string): Attr | null;

  removeAttributeNode(attr: Attr): Attr;
}

export class Element {
  constructor(readonly tagName: string) {
    Node.call(this, NodeType.ELEMENT_NODE, tagName);
    constructChildNode(this);
    constructParentNode(this);

    this._attributesMap = null;
  }
}

const prototype = extendsClass(Element, Node);

extendsChildNode(prototype);
extendsContainer(prototype);
extendsParentNode(prototype);

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName);
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
