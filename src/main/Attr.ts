import { Node } from './Node';
import { Element } from './Element';
import { NodeType } from './NodeType';

export interface Attr extends Node {}

export class Attr {
  readonly ownerElement: Element | null;
  readonly name: string;

  value: string;

  constructor(name: string, value = '') {
    Node.call(this, NodeType.ATTRIBUTE_NODE);

    this.ownerElement = null;
    this.name = name;
    this.value = value;
  }
}
