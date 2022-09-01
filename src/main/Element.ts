import { Node } from './Node';
import { extendNode } from './extendNode';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, extendChildNode } from './extendChildNode';
import { extendParentNode, ParentNode } from './extendParentNode';
import { uncheckedCloneContents } from './uncheckedCloneContents';

export interface Element extends Node, ChildNode, ParentNode {
  // readonly
  tagName: string;
  attrs: { [name: string]: string };

  setAttribute(name: string, value: string): this;

  getAttribute(name: string): string | undefined;

  hasAttribute(name: string): boolean;

  removeAttribute(name: string): this;

  getAttributeNames(): string[];
}

export class Element {
  constructor(tagName: string, attrs: { [name: string]: string } = {}) {
    this.nodeName = this.tagName = tagName;
    this.attrs = attrs;
  }
}

const prototype = extendClass(Element, Node);

prototype.nodeType = NodeType.ELEMENT_NODE;

extendChildNode(prototype);
extendNode(prototype);
extendParentNode(prototype);

prototype.setAttribute = function (name, value) {
  this.attrs[name] = value;
  return this;
};

prototype.getAttribute = function (name) {
  return this.attrs[name];
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
