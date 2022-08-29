import { Node } from './Node';
import { Element } from './Element';
import { NodeType } from './NodeType';
import { extendsClass, defineProperty } from './utils';

export interface Attr extends Node {
  value: string;
}

export class Attr {
  /*readonly*/ ownerElement: Element | null;
  /*readonly*/ name: string;

  /*private*/ _value: string;

  constructor(name: string, value = '') {
    Node.call(this, NodeType.ATTRIBUTE_NODE, name);

    this.ownerElement = null;
    this.name = name;
    this._value = value;
  }
}

const prototype = extendsClass(Attr, Node);

defineProperty(prototype, 'value', {
  get() {
    const { ownerElement } = this;

    if (ownerElement) {
      return ownerElement._attributesMap!.get(this.name)!;
    } else {
      return this._value;
    }
  },
  set(value) {
    const { ownerElement } = this;

    if (ownerElement) {
      ownerElement._attributesMap!.set(this.name, value);
    } else {
      this._value = value;
    }
  },
});

defineProperty(prototype, 'nodeValue', {
  get() {
    return this.value;
  },
  set(value) {
    this.value = value !== null ? value : '';
  },
});
