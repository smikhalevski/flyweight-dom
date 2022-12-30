import { Node } from './Node';
import { die, extendClass, isEqualChildNodes, isEqualConstructor, isSpaceChar } from './utils';
import { NodeType } from './NodeType';
import { ChildNode, extendChildNode } from './ChildNode';
import { extendParentNode, ParentNode } from './ParentNode';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DOMTokenList } from './DOMTokenList';
import { Text } from './Text';

export type InsertPosition = 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';

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

  insertAdjacentElement(position: InsertPosition, element: Element): Element | null;

  insertAdjacentText(position: InsertPosition, data: string): void;
}

export class Element {
  constructor(tagName: string, attributes?: { [name: string]: string }) {
    this.nodeName = this.tagName = tagName;
    this._attributes = attributes;
  }
}

const prototype = extendClass(Element, Node);

prototype.nodeType = NodeType.ELEMENT_NODE;

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

prototype.insertAdjacentElement = function (position, element) {
  return insertAdjacentNode(this, position, element);
};

prototype.insertAdjacentText = function (position, data) {
  for (let i = 0, dataLength = data.length; i < dataLength; ++i) {
    if (!isSpaceChar(data.charCodeAt(i))) {
      return insertAdjacentNode(this, position, new Text(data));
    }
  }
};

prototype.isEqualNode = function (otherNode) {
  return (
    isEqualConstructor(this, otherNode) &&
    this.tagName == otherNode.tagName &&
    isEqualAttributes(this._attributes, otherNode._attributes) &&
    isEqualChildNodes(this, otherNode)
  );
};

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName, Object.assign({}, this._attributes));
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};

function isEqualAttributes(attributes: Element['_attributes'], otherAttributes: Element['_attributes']): boolean {
  if (attributes === undefined) {
    return otherAttributes === undefined || Object.keys(otherAttributes).length === 0;
  }
  if (otherAttributes === undefined) {
    return Object.keys(attributes).length === 0;
  }
  let attributeCount = 0;

  for (const key in attributes) {
    ++attributeCount;

    if (attributes[key] !== otherAttributes[key]) {
      return false;
    }
  }
  return Object.keys(otherAttributes).length === attributeCount;
}

function insertAdjacentNode<T extends Node>(element: Element, position: InsertPosition, node: T): T | null {
  if (position === 'beforeBegin') {
    if (element.parentNode === null) {
      return null;
    }
    element.before(node);
    return node;
  }
  if (position === 'afterBegin') {
    element.prepend(node);
    return node;
  }
  if (position === 'beforeEnd') {
    element.append(node);
    return node;
  }
  if (position === 'afterEnd') {
    if (element.parentNode === null) {
      return null;
    }
    element.after(node);
    return node;
  }
  die("The value provided ('" + position + "') is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'");
}
