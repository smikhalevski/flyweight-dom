import { Node } from './Node';
import { extendsContainer } from './extendContainer';
import { uncheckedCloneChildNodes } from './utils-unchecked';
import { createPrototype } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, extendsChildNode } from './extendsChildNode';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NonDocumentTypeChildNode } from './NonDocumentTypeChildNode';

/**
 * @internal
 */
export interface Element extends Node, ChildNode, NonDocumentTypeChildNode, ParentNode {
  /*readonly*/ attributes: NamedNodeMap;

  className: string;
  id: string;

  /*private*/ _attributesMap: Map<string, string> | null;

  getAttribute(name: string): string | null;

  getAttributeNames(): string[];

  getAttributeNode(name: string): Attr | null;

  hasAttribute(name: string): boolean;

  hasAttributes(): boolean;

  removeAttribute(name: string): void;

  removeAttributeNode(attr: Attr): Attr;

  setAttribute(name: string, value: string): void;

  setAttributeNode(attr: Attr): Attr | null;
}

/**
 * @internal
 */
export class Element {
  constructor(readonly tagName: string) {
    Node.call(this, NodeType.ELEMENT_NODE, tagName);

    this.childElementCount = 0;
    this.firstElementChild =
      this.lastElementChild =
      this.nextElementSibling =
      this.previousElementSibling =
      this._children =
      this._attributesMap =
        null;
  }
}

const prototype: Element = (Element.prototype = createPrototype(Node.prototype));

extendsChildNode(prototype);
extendsContainer(prototype);
extendsParentNode(prototype);

prototype.cloneNode = function (deep?: boolean): Node {
  const node = new Element(this.tagName);
  if (deep) {
    uncheckedCloneChildNodes(this, node);
  }
  return node;
};
