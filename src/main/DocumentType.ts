import { Node } from './Node';
import { ChildNode } from './constructChildNode';
import { NodeType } from './NodeType';
import { extendClass } from './utils';
import { constructNode } from './constructNode';

export interface DocumentType extends Node, ChildNode {}

export class DocumentType {
  readonly name: string;
  readonly publicId: string;
  readonly systemId: string;

  constructor(name: string, publicId = '', systemId = '') {
    constructNode(this, NodeType.DOCUMENT_TYPE_NODE, name);

    this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }
}

const prototype = extendClass(DocumentType, Node);

prototype.cloneNode = function () {
  return new DocumentType(this.name, this.publicId, this.systemId);
};
