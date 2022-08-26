import { Node } from './Node';
import { Element } from './Element';
import { NodeType } from './NodeType';
import { createPrototype } from './utils';

export interface Attr extends Node {}

export class Attr {
  readonly ownerElement: Element | null;
  readonly name: string;

  value: string;

  constructor(name: string, value = '') {
    Node.call(this, NodeType.ATTRIBUTE_NODE, name);

    this.ownerElement = null;
    this.name = name;
    this.value = value;
  }
}

// Attr.prototype = createPrototype(Node.prototype, {
//   nodeValue: {
//     get(this: Attr): Attr['nodeValue'] {
//       return this.value;
//     },
//     set(this: Attr, value: Attr['nodeValue']): void {
//       this.value = value !== null ? value : '';
//     },
//   }
// });
