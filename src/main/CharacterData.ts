import { createPrototype, defineProperty, PropertyDescriptor } from './utils';
import { Node } from './Node';
import { constructNonDocumentTypeChildNode, NonDocumentTypeChildNode } from './NonDocumentTypeChildNode';
import { ChildNode, extendsChildNode } from './ChildNode';

export interface CharacterData extends Node, ChildNode, NonDocumentTypeChildNode {
  readonly length: number;

  data: string;

  appendData(data: string): void;

  deleteData(offset: number, count: number): void;

  insertData(offset: number, data: string): void;

  replaceData(offset: number, count: number, data: string): void;

  substringData(offset: number, count: number): string;
}

export class CharacterData {
  constructor(nodeType: number, nodeName: string, data = '') {
    Node.call(this, nodeType, nodeName);
    constructNonDocumentTypeChildNode(this);

    this.data = data;
  }
}

const prototype: CharacterData = (CharacterData.prototype = createPrototype(Node.prototype));

extendsChildNode(prototype);

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
