import { createPrototype, defineProperty } from './utils';
import { Node } from './Node';
import { ChildNode } from './extendChildNode';

export interface CharacterData extends Node, ChildNode {
  readonly length: number;

  data: string;

  appendData(data: string): void;

  deleteData(offset: number, count: number): void;

  insertData(offset: number, data: string): void;

  replaceData(offset: number, count: number, data: string): void;

  substringData(offset: number, count: number): string;
}

export class CharacterData {
  constructor(nodeType: number, data = '') {
    Node.call(this, nodeType);

    this.data = data;
  }
}

const prototype: CharacterData = (CharacterData.prototype = createPrototype(Node.prototype));

defineProperty(prototype, 'length', {
  get(this: CharacterData): CharacterData['length'] {
    return this.data.length;
  },
});

defineProperty(prototype, 'nodeValue', {
  get(this: CharacterData): CharacterData['nodeValue'] {
    return this.data;
  },
  set(this: CharacterData, value: CharacterData['nodeValue']): void {
    this.data = value !== null ? value : '';
  },
});

prototype.appendData = function (data) {
  this.data += data;
};

prototype.deleteData = function (offset, count) {
  this.data = this.data.substring(0, offset) + this.data.substring(offset + count);
};

prototype.insertData = function (offset, data) {
  this.data = this.data.substring(0, offset) + data + this.data.substring(offset);
};

prototype.replaceData = function (offset, count, data) {
  this.data = this.data.substring(0, offset) + data + this.data.substring(offset + count);
};

prototype.substringData = function (offset, count) {
  return this.data.substring(offset, offset + count);
};
