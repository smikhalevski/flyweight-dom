import { Node } from './Node';
import { extendsContainer } from './extendsContainer';
import { extendsClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, constructChildNode, extendsChildNode } from './extendsChildNode';
import { constructParentNode, extendsParentNode, ParentNode } from './extendsParentNode';
import { uncheckedCloneContents } from './unchecked';

export interface Element extends Node, ChildNode, ParentNode {
  /*readonly*/ attrs: { /*readonly*/ [name: string]: string } | null;

  setAttribute(name: string, value: string): void;

  getAttribute(name: string): string | null;

  removeAttribute(name: string): void;

  hasAttribute(name: string): boolean;

  getAttributeNames(): string[];
}

export class Element {
  readonly tagName: string;

  constructor(tagName: string) {
    Node.call(this, NodeType.ELEMENT_NODE, tagName);
    constructChildNode(this);
    constructParentNode(this);

    this.tagName = tagName;
    this.attrs = null;
  }
}

const prototype = extendsClass(Element, Node);

extendsChildNode(prototype);
extendsContainer(prototype);
extendsParentNode(prototype);

prototype.setAttribute = function (name, value) {
  const { attrs } = this;

  if (attrs) {
    attrs[name] = value;
  } else {
    this.attrs = { [name]: value };
  }
};

prototype.getAttribute = function (name) {
  const { attrs } = this;

  if (attrs) {
    const value = attrs[name];

    if (value != null) {
      return value;
    }
  }
  return null;
};

prototype.removeAttribute = function (name) {
  if (this.attrs) {
    delete this.attrs[name];
  }
};

prototype.hasAttribute = function (name) {
  return this.attrs != null && this.attrs[name] != null;
};

prototype.getAttributeNames = function () {
  return this.attrs ? Object.keys(this.attrs) : [];
};

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName);
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  if (this.attrs) {
    node.attrs = Object.assign({}, this.attrs);
  }
  return node;
};
