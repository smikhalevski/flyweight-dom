import { Constructor, extendClass, isEqualConstructor, TypedPropertyDescriptor } from './utils';
import { Node } from './Node';
import { ChildNode, extendChildNode } from './ChildNode';

export interface CharacterData extends Node, ChildNode {
  readonly length: number;

  data: string;

  appendData(data: string): this;

  deleteData(offset: number, count: number): this;

  insertData(offset: number, data: string): this;

  replaceData(offset: number, count: number, data: string): this;

  substringData(offset: number, count: number): string;
}

// abstract
export class CharacterData {}

const nodeValuePropertyDescriptor: TypedPropertyDescriptor<CharacterData, string | null> = {
  get() {
    return this.data;
  },
  set(value) {
    this.data = value != null ? value : '';
  },
};

const prototype = extendClass(CharacterData, Node, {
  length: {
    get() {
      return this.data.length;
    },
  },

  nodeValue: nodeValuePropertyDescriptor,
  textContent: nodeValuePropertyDescriptor,
});

extendChildNode(prototype);

prototype.appendData = function (data) {
  this.data += data;
  return this;
};

prototype.deleteData = function (offset, count) {
  this.data = this.data.substring(0, offset) + this.data.substring(offset + count);
  return this;
};

prototype.insertData = function (offset, data) {
  this.data = this.data.substring(0, offset) + data + this.data.substring(offset);
  return this;
};

prototype.replaceData = function (offset, count, data) {
  this.data = this.data.substring(0, offset) + data + this.data.substring(offset + count);
  return this;
};

prototype.substringData = function (offset, count) {
  return this.data.substring(offset, offset + count);
};

prototype.isEqualNode = function (otherNode) {
  return isEqualConstructor(this, otherNode) && otherNode.data === this.data;
};

prototype.cloneNode = function () {
  const node = new (this.constructor as Constructor)();
  node.data = this.data;
  return node;
};
