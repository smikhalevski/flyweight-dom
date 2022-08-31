import { Node } from './Node';
import { extendsContainer } from './extendsContainer';
import { extendsClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, constructChildNode, extendsChildNode } from './extendsChildNode';
import { constructParentNode, extendsParentNode, ParentNode } from './extendsParentNode';
import { uncheckedCloneContents } from './unchecked';

export interface Element extends Node, ChildNode, ParentNode {
  setAttribute(name: string, value: string): this;

  getAttribute(name: string): string | null;

  hasAttribute(name: string): boolean;

  removeAttribute(name: string): this;

  getAttributeNames(): string[];
}

export class Element {
  readonly tagName: string;
  readonly attrs: { [name: string]: string };

  constructor(tagName: string, attrs: { [name: string]: string } = {}) {
    Node.call(this, NodeType.ELEMENT_NODE, tagName);
    constructParentNode(this);
    constructChildNode(this);

    this.tagName = tagName;
    this.attrs = attrs;
  }
}

const prototype = extendsClass(Element, Node);

extendsChildNode(prototype);
extendsContainer(prototype);
extendsParentNode(prototype);

prototype.setAttribute = function (name, value) {
  this.attrs[name] = value;
  return this;
};

prototype.getAttribute = function (name) {
  return this.attrs[name] ?? null;
};

prototype.hasAttribute = function (name) {
  return this.attrs[name] != null;
};

prototype.removeAttribute = function (name) {
  delete this.attrs[name];
  return this;
};

prototype.getAttributeNames = function () {
  return Object.keys(this.attrs);
};

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName, Object.assign({}, this.attrs));
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
