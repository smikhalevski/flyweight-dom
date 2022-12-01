import { Node } from './Node';
import { ChildNode } from './extendChildNode';
import { NodeType } from './NodeType';
import { extendClass } from './utils';

export interface DocumentType extends Node, ChildNode {
  // public readonly
  name: string;
  publicId: string;
  systemId: string;
}

export class DocumentType {
  constructor(name: string, publicId = '', systemId = '') {
    this.nodeName = this.name = String(name);
    this.publicId = String(publicId);
    this.systemId = String(systemId);
  }
}

const prototype = extendClass(DocumentType, Node);

prototype.nodeType = NodeType.DOCUMENT_TYPE_NODE;

prototype.cloneNode = function () {
  return new DocumentType(this.name, this.publicId, this.systemId);
};
