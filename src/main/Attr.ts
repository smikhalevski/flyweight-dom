import { Node } from './Node';
import { Element } from './Element';
import { NodeType } from './NodeType';
import { createPrototype, defineProperty } from './utils';

/**
 * @internal
 */
export interface Attr extends Node {}

/**
 * @internal
 */
export class Attr {
  /*readonly*/ ownerElement: Element | null;
  /*readonly*/ name: string;

  value: string;

  constructor(name: string, value = '') {
    Node.call(this, NodeType.ATTRIBUTE_NODE, name);

    this.ownerElement = null;
    this.name = name;
    this.value = value;
  }
}

const prototype: Attr = (Attr.prototype = createPrototype(Node.prototype));

defineProperty(prototype, 'nodeValue', {
  get() {
    return this.value;
  },
  set(value) {
    this.value = value !== null ? value : '';
  },
});
