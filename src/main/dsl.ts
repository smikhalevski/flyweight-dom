import { Attributes, Element } from './Element';
import { Node } from './Node';
import { Document } from './Document';
import { DocumentType } from './DocumentType';
import { DocumentFragment } from './DocumentFragment';
import { ProcessingInstruction } from './ProcessingInstruction';
import { Comment } from './Comment';
import { CDATASection } from './CDATASection';

export type Child = Node | string;

export type DSL = NodeFactories & ElementFactories;

export interface NodeFactories {
  doc(...children: Child[]): Document;
  doctype(name: string, publicId?: string, systemId?: string): DocumentType;
  f(...children: Child[]): DocumentFragment;
  pi(target: string, data?: string): ProcessingInstruction;
  cdata(data?: string): CDATASection;
  comment(data?: string): Comment;
}

export interface ElementFactories {
  [tagName: string]: {
    (attributes: Attributes, ...children: Child[]): Element;

    (...children: Child[]): Element;
  };
}

const nodeFactories: NodeFactories = {
  doc(...children: Child[]): Document {
    return new Document().append(...children);
  },

  doctype(name: string, publicId?: string, systemId?: string): DocumentType {
    return new DocumentType(name, publicId, systemId);
  },

  f(...children: Child[]): DocumentFragment {
    return new DocumentFragment().append(...children);
  },

  pi(target: string, data?: string): ProcessingInstruction {
    return new ProcessingInstruction(target, data);
  },

  cdata(data?: string): CDATASection {
    return new CDATASection(data);
  },

  comment(data?: string): Comment {
    return new Comment(data);
  },
};

const proxyHandler: ProxyHandler<any> = {
  get(target: any, key: string, _receiver: any): any {
    if (target.hasOwnProperty(key)) {
      return target[key];
    }

    const elementFactory = function () {
      if (arguments.length === 0) {
        return new Element(key);
      }

      const arg = arguments[0];

      let element;

      if (arg === null || typeof arg !== 'object' || arg instanceof Node) {
        element = new Element(key).append(arg);
      } else {
        element = new Element(key, arg);
      }

      for (let i = 1; i < arguments.length; ++i) {
        element.append(arguments[i]);
      }

      return element;
    };

    target[key] = elementFactory;

    return elementFactory;
  },
};

const dsl: DSL = new Proxy<any>(nodeFactories, proxyHandler);

export default dsl;
