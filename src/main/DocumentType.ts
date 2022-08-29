import { Node } from './Node';
import { ChildNode } from './extendsChildNode';
import { NodeType } from './NodeType';
import { extendsClass } from './utils';

/**
 * @internal
 */
export interface DocumentType extends Node, ChildNode {}

/**
 * @internal
 */
export class DocumentType {
  /*readonly*/ name: string;
  /*readonly*/ publicId: string;
  /*readonly*/ systemId: string;

  constructor(name: string, publicId: string, systemId: string) {
    Node.call(this, NodeType.DOCUMENT_TYPE_NODE, name);

    this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }
}

const prototype = extendsClass(DocumentType, Node);

prototype.cloneNode = function () {
  return new DocumentType(this.name, this.publicId, this.systemId);
};
