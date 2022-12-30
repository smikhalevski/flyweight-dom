import { Node } from './Node';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, extendChildNode } from './extendChildNode';
import { extendParentNode, ParentNode } from './extendParentNode';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DOMTokenList } from './DOMTokenList';
import { extendNode } from './extendNode';

export interface Element extends Node, ChildNode, ParentNode {
  // readonly
  tagName: string;
  id: string;
  className: string;
  classList: DOMTokenList;

  // private
  _attributes: { [name: string]: string } | undefined;

  setAttribute(name: string, value: string): this;

  getAttribute(name: string): string | null;

  hasAttribute(name: string): boolean;

  removeAttribute(name: string): this;

  toggleAttribute(name: string, force?: boolean): boolean;

  getAttributeNames(): string[];
}

export class Element {
  constructor(tagName: string, attributes?: { [name: string]: string }) {
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
      return this.getAttribute('id') || '';
    },
    set(this: Element, value) {
      this.setAttribute('id', value);
    },
  },

  className: {
    get(this: Element) {
      return this.getAttribute('class') || '';
    },
    set(this: Element, value) {
      this.setAttribute('class', value);
    },
  },

  classList: {
    get(this: Element) {
      const tokenList = new DOMTokenList({
        get: () => {
          return this.getAttribute('class') || '';
        },
        set: value => {
          this.setAttribute('class', value);
        },
      });

      Object.defineProperty(this, 'classList', { value: tokenList });

      return tokenList;
    },
  },
});

prototype.setAttribute = function (name, value) {
  if (this._attributes === undefined) {
    this._attributes = {};
  }
  this._attributes[name] = '' + value;
  return this;
};

prototype.getAttribute = function (name) {
  return this._attributes !== undefined && this._attributes[name] !== undefined ? this._attributes[name] : null;
};

prototype.hasAttribute = function (name) {
  return this._attributes !== undefined && this._attributes[name] !== undefined;
};

prototype.removeAttribute = function (name) {
  if (this._attributes !== undefined) {
    delete this._attributes[name];
  }
  return this;
};

prototype.toggleAttribute = function (name, force) {
  const value = this.getAttribute(name);
  const exists = value !== null;

  if (!exists && (force === undefined || force)) {
    this.setAttribute(name, '');
    return true;
  }

  if (exists && (force === undefined || !force)) {
    this.removeAttribute(name);
    return false;
  }

  return exists;
};

prototype.getAttributeNames = function () {
  return this._attributes !== undefined ? Object.keys(this._attributes) : [];
};

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName, Object.assign({}, this._attributes));
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};
