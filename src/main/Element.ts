import { Node } from './Node';
import { extendsContainer } from './extendsContainer';
import { defineProperty, extendsClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, constructChildNode, extendsChildNode } from './extendsChildNode';
import { constructParentNode, extendsParentNode, ParentNode } from './extendsParentNode';
import { uncheckedCloneContents } from './unchecked';

export interface Element extends Node, ChildNode, ParentNode {
  readonly attrs: { /*readonly*/ [name: string]: string };

  /*private*/ _attrs: { [name: string]: string } | null;

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
    this._attrs = null;
  }
}

const prototype = extendsClass(Element, Node);

extendsChildNode(prototype);
extendsContainer(prototype);
extendsParentNode(prototype);

defineProperty(prototype, 'attrs', {
  get() {
    const attrs = (this._attrs ||= {});

    defineProperty(prototype, 'attrs', { value: attrs });

    return attrs;
  },
});

prototype.setAttribute = function (name, value) {
  const attrs = this._attrs;

  if (attrs) {
    attrs[name] = value;
  } else {
    this._attrs = { [name]: value };
  }
};

prototype.getAttribute = function (name) {
  const attrs = this._attrs;

  if (attrs) {
    const value = attrs[name];

    if (value != null) {
      return value;
    }
  }
  return null;
};

prototype.removeAttribute = function (name) {
  if (this._attrs) {
    delete this._attrs[name];
  }
};

prototype.hasAttribute = function (name) {
  return this._attrs != null && this._attrs[name] != null;
};

prototype.getAttributeNames = function () {
  return this._attrs ? Object.keys(this._attrs) : [];
};

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName);
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  if (this._attrs) {
    node._attrs = Object.assign({}, this._attrs);
  }
  return node;
};
