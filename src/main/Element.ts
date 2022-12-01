import { Node } from './Node';
import { extendNode } from './extendNode';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, extendChildNode } from './extendChildNode';
import { extendParentNode, ParentNode } from './extendParentNode';
import { uncheckedCloneContents } from './uncheckedCloneContents';
import { createDOMTokenList, DOMTokenList } from './DOMTokenList';

export interface Element extends Node, ChildNode, ParentNode {
  // readonly
  tagName: string;
  attrs: { [name: string]: string };
  id: string;
  className: string;
  classList: DOMTokenList;

  setAttribute(name: string, value: string): this;

  getAttribute(name: string): string | null;

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

Object.defineProperties(prototype, {
  id: {
    get(this: Element) {
      return this.attrs.id || '';
    },
    set(this: Element, value) {
      this.attrs.id = String(value);
    },
  },

  className: {
    get(this: Element) {
      return this.attrs.className || '';
    },
    set(this: Element, value) {
      this.attrs.className = String(value);
    },
  },

  classList: {
    get(this: Element) {
      const tokenList = createDOMTokenList({
        get: () => this.className,
        set: value => {
          this.className = value;
        },
      });

      Object.defineProperty(this, 'classList', { value: tokenList });

      return tokenList;
    },
  },
});

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
