import { Node } from './Node';
import { Attr } from './Attr';
import { extendNode } from './extendNode';
import { uncheckedCloneChildNodes } from './node-utils';
import { createPrototype, defineProperty, isString } from './utils';
import { NamedNodeMap } from './NamedNodeMap';
import { NodeType } from './NodeType';

export interface Element extends Node {
  readonly rawAttributes: { [name: string]: string };
  readonly attributes: NamedNodeMap;

  className: string;
  id: string;

  getAttribute(name: string): string | null;

  getAttributeNames(): string[];

  getAttributeNode(name: string): Attr | null;

  hasAttribute(name: string): boolean;

  hasAttributes(): boolean;

  removeAttribute(name: string): void;

  removeAttributeNode(attr: Attr): Attr;

  setAttribute(name: string, value: string): void;

  setAttributeNode(attr: Attr): Attr | null;
}

export class Element {
  constructor(readonly tagName: string) {
    Node.call(this, NodeType.ELEMENT_NODE);
  }
}

const prototype: Element = (Element.prototype = createPrototype(Node.prototype));

extendNode(prototype);

defineProperty(prototype, 'attributes', {
  get(this: Element): Element['attributes'] {
    const { rawAttributes } = this;

    const attributes = new NamedNodeMap(rawAttributes);

    const proxy = new Proxy(rawAttributes, {
      set(rawAttributes, name, value) {
        if (isString(name)) {
          attributes.getNamedItem(name)!.value = value;
          rawAttributes[name] = value;
        }
        return true;
      },
    });

    defineProperty(this, 'rawAttributes', { value: proxy });
    defineProperty(this, 'attributes', { value: attributes });

    return attributes;
  },
});

// defineProperty(prototype, 'className', {
//   get(this: Element) {},
//   set(this: Element, value: string) {},
// });
//
// defineProperty(prototype, 'id', {
//   get(this: Element) {},
//   set(this: Element, value: string) {},
// });

prototype.getAttribute = function (name) {
  return null;
};

prototype.getAttributeNames = function () {
  return [];
};

prototype.getAttributeNode = function (name) {
  return null;
};

prototype.hasAttribute = function (name) {
  return false;
};

prototype.hasAttributes = function (this: Element) {
  return false;
};

prototype.removeAttribute = function (name) {};

prototype.removeAttributeNode = function (attr) {
  return attr;
};

prototype.setAttribute = function (name, value) {};

prototype.setAttributeNode = function (attr) {
  return null;
};

prototype.cloneNode = function (deep?: boolean): Node {
  const node = new Element(this.tagName);
  if (deep) {
    uncheckedCloneChildNodes(this, node);
  }
  return node;
};
