import { Node } from './Node';
import { die, extendClass, isEqualChildNodes, isEqualConstructor, isSpaceChar, NodeType } from './utils';
import { ChildNode, extendChildNode } from './ChildNode';
import { extendParentNode, ParentNode } from './ParentNode';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DOMTokenList } from './DOMTokenList';
import { Text } from './Text';

const ATTRIBUTES = Symbol('attributes');

export interface Attributes {
  [name: string]: string;
}

export type InsertPosition = 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';

export interface Element extends Node, ChildNode, ParentNode {
  // readonly
  tagName: string;
  id: string;
  className: string;
  classList: DOMTokenList;

  // private
  [ATTRIBUTES]: Attributes | undefined;

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
  constructor(tagName: string, attributes?: Attributes) {
    this.nodeName = this.tagName = tagName;
    this[ATTRIBUTES] = attributes;
  }
}

const prototype = extendClass(Element, Node, {
  nodeType: { value: NodeType.ELEMENT_NODE },

  id: {
    get() {
      return this.getAttribute('id') || '';
    },
    set(value) {
      this.setAttribute('id', value);
    },
  },

  className: {
    get() {
      return this.getAttribute('class') || '';
    },
    set(value) {
      this.setAttribute('class', value);
    },
  },

  classList: {
    get() {
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

extendChildNode(Element);
extendParentNode(Element);

prototype.setAttribute = function (name, value) {
  if (this[ATTRIBUTES] === undefined) {
    this[ATTRIBUTES] = {};
  }
  this[ATTRIBUTES][name] = '' + value;
  return this;
};

prototype.getAttribute = function (name) {
  return this[ATTRIBUTES] !== undefined && this[ATTRIBUTES][name] !== undefined ? this[ATTRIBUTES][name] : null;
};

prototype.hasAttribute = function (name) {
  return this[ATTRIBUTES] !== undefined && this[ATTRIBUTES][name] !== undefined;
};

prototype.removeAttribute = function (name) {
  if (this[ATTRIBUTES] !== undefined) {
    delete this[ATTRIBUTES][name];
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
  return this[ATTRIBUTES] !== undefined ? Object.keys(this[ATTRIBUTES]) : [];
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
    isEqualAttributes(this[ATTRIBUTES], otherNode[ATTRIBUTES]) &&
    isEqualChildNodes(this, otherNode)
  );
};

prototype.cloneNode = function (deep) {
  const node = new Element(this.tagName, Object.assign({}, this[ATTRIBUTES]));
  if (deep) {
    uncheckedCloneChildren(this, node);
  }
  return node;
};

function isEqualAttributes(attributes: Attributes | undefined, otherAttributes: Attributes | undefined): boolean {
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
