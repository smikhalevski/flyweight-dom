import { Attributes, Element } from './Element';
import { Node } from './Node';
import { Text } from './Text';
import { ParentNode } from './ParentNode';
import { Document } from './Document';
import { DocumentType } from './DocumentType';
import { DocumentFragment } from './DocumentFragment';
import { ProcessingInstruction } from './ProcessingInstruction';
import { Comment } from './Comment';
import { CDATASection } from './CDATASection';
import { die } from './utils';

export type DSL = NodeFactories & ElementFactories;

export type Child = Node | string | number | boolean | bigint | null | undefined;

export interface NodeFactories {
  doc(...children: Child[]): Document;

  doctype(name: string, publicId?: string, systemId?: string): DocumentType;

  f(...children: Child[]): DocumentFragment;

  pi(target: string, data?: string): ProcessingInstruction;

  cdata(data?: string): CDATASection;

  comment(data?: string): Comment;
}

export interface ElementFactory {
  (attributes: Attributes, ...children: Child[]): Element;

  (...children: Child[]): Element;
}

export interface ElementFactories {
  [tagName: string]: ElementFactory;
}

const nodeFactories: NodeFactories = {
  doc() {
    const node = new Document();

    for (let i = 0; i < arguments.length; ++i) {
      appendChild(node, arguments[i]);
    }

    return node;
  },

  doctype(name, publicId, systemId) {
    return new DocumentType(name, publicId, systemId);
  },

  f() {
    const node = new DocumentFragment();

    for (let i = 0; i < arguments.length; ++i) {
      appendChild(node, arguments[i]);
    }

    return node;
  },

  pi(target, data) {
    return new ProcessingInstruction(target, data);
  },

  cdata(data) {
    return new CDATASection(data);
  },

  comment(data) {
    return new Comment(data);
  },
};

const proxyHandler: ProxyHandler<any> = {
  get(target, key: string, _receiver) {
    return target.hasOwnProperty(key) ? target[key] : (target[key] = createElementFactory(key));
  },
};

function createElementFactory(tagName: string): ElementFactory {
  return function () {
    if (arguments.length === 0) {
      return new Element(tagName);
    }

    const arg = arguments[0];

    let element;

    if (arg === null || typeof arg !== 'object' || arg instanceof Node) {
      element = new Element(tagName);
      appendChild(element, arg);
    } else {
      element = new Element(tagName, arg);
    }

    for (let i = 1; i < arguments.length; ++i) {
      appendChild(element, arguments[i]);
    }

    return element;
  };
}

function appendChild(parent: ParentNode, child: Child): void {
  if (child === null || child === undefined) {
    return;
  }
  if (
    typeof child === 'string' ||
    typeof child === 'number' ||
    typeof child === 'boolean' ||
    typeof child === 'bigint'
  ) {
    parent.appendChild(new Text(child.toString()));
    return;
  }
  if (child instanceof Node) {
    parent.appendChild(child);
    return;
  }
  die('Cannot append a child');
}

const dsl: DSL = new Proxy(nodeFactories, proxyHandler);

export default dsl;
