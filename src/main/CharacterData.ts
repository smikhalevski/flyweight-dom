import { Constructor, defineProperty, extendClass, PropertyDescriptor } from './utils';
import { Node } from './Node';
import { ChildNode, extendChildNode } from './extendChildNode';

export interface CharacterData extends Node, ChildNode {
  // public readonly
  length: number;

  // public
  data: string;

  appendData(data: string): this;

  deleteData(offset: number, count: number): this;

  insertData(offset: number, data: string): this;

  replaceData(offset: number, count: number, data: string): this;

  substringData(offset: number, count: number): string;
}

// abstract
export class CharacterData {}

const prototype = extendClass(CharacterData, Node);

extendChildNode(prototype);

prototype.nextElementSibling = prototype.previousElementSibling = null;

const dataDescriptor: PropertyDescriptor<CharacterData, string | null> = {
  get() {
    return this.data;
  },
  set(value) {
    this.data = value != null ? value : '';
  },
};

defineProperty(prototype, 'length', {
  get() {
    return this.data.length;
  },
});

defineProperty(prototype, 'nodeValue', dataDescriptor);

defineProperty(prototype, 'textContent', dataDescriptor);

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

prototype.cloneNode = function () {
  return new (this.constructor as Constructor)(this.data);
};
