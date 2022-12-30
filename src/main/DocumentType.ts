import { Node } from './Node';
import { ChildNode, extendChildNode } from './extendChildNode';
import { NodeType } from './NodeType';
import { extendClass, isEqualConstructor } from './utils';

export interface DocumentType extends Node, ChildNode {
  // public readonly
  name: string;
  publicId: string;
  systemId: string;
}

export class DocumentType {
  constructor(name: string, publicId = '', systemId = '') {
    this.nodeName = this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }
}

const prototype = extendClass(DocumentType, Node);

prototype.nodeType = NodeType.DOCUMENT_TYPE_NODE;

extendChildNode(prototype);

prototype.isEqualNode = function (otherNode) {
  return (
    isEqualConstructor(this, otherNode) &&
    this.name === otherNode.name &&
    this.publicId === otherNode.publicId &&
    this.systemId === otherNode.systemId
  );
};

prototype.cloneNode = function () {
  return new DocumentType(this.name, this.publicId, this.systemId);
};
