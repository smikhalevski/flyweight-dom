import { Node } from './Node';
import { constructNode, extendNode } from './constructNode';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, constructChildNode, extendChildNode } from './constructChildNode';
import { constructParentNode, extendParentNode, ParentNode } from './constructParentNode';
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

  constructor(tagName: string, attrs?: any) {
    constructNode(this, NodeType.ELEMENT_NODE, tagName);
    constructParentNode(this);
    constructChildNode(this);

    this.tagName = tagName;
    this.attrs = attrs;
  }
}

const prototype = extendClass(Element, Node);

extendChildNode(prototype);
extendNode(prototype);
extendParentNode(prototype);

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
