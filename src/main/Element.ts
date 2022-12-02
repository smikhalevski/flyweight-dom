import { Node } from './Node';
import { extendNode } from './extendNode';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, extendChildNode } from './extendChildNode';
import { extendParentNode, ParentNode } from './extendParentNode';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DOMTokenList } from './DOMTokenList';

export interface Element extends Node, ChildNode, ParentNode {
  // readonly
  tagName: string;
  id: string;
  className: string;
  classList: DOMTokenList;

  // private
  _attributes: { [name: string]: string };

  setAttribute(name: string, value: string): this;

  getAttribute(name: string): string | null;

  hasAttribute(name: string): boolean;

  removeAttribute(name: string): this;

  getAttributeNames(): string[];
}

export class Element {
  constructor(tagName: string, attributes: { [name: string]: string } = {}) {
    this.nodeName = this.tagName = tagName;
    this._attributes = attributes;
  }
}

const prototype = extendClass(Element, Node);

prototype.nodeType = NodeType.ELEMENT_NODE;

extendNode(prototype);
extendChildNode(prototype);
extendParentNode(prototype);

Object.defineProperties(prototype, {
  id: {
    get(this: Element) {
      return this._attributes.id || '';
    },
    set(this: Element, value) {
      this._attributes.id = value;
    },
  },

  className: {
    get(this: Element) {
      return this._attributes.class || '';
    },
    set(this: Element, value) {
      this._attributes.class = value;
    },
  },

  classList: {
    get(this: Element) {
      const tokenList = new DOMTokenList({
        get: () => this._attributes.class || '',
        set: value => {
          this._attributes.class = value;
        },
      });

      Object.defineProperty(this, 'classList', { value: tokenList });

      return tokenList;
    },
  },
});

prototype.setAttribute = function (name, value) {
  this._attributes[name] = value;
  return this;
};

prototype.getAttribute = function (name) {
  return this._attributes[name] ?? null;
};

prototype.hasAttribute = function (name) {
  return this._attributes[name] != null;
};

prototype.removeAttribute = function (name) {
  delete this._attributes[name];
  return this;
};

prototype.getAttributeNames = function () {
  return Object.keys(this._attributes);
};

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName, Object.assign({}, this._attributes));
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};
