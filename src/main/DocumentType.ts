import { Node } from './Node';
import { ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';

export interface DocumentType extends Node, ParentNode {}

export class DocumentType {
  /*readonly*/ name: string;
  /*readonly*/ publicId: string;
  /*readonly*/ systemId: string;

  constructor(name: string) {
    Node.call(this, NodeType.DOCUMENT_TYPE_NODE, name);

    this.name = name;
    this.publicId = '';
    this.systemId = '';
  }
}
