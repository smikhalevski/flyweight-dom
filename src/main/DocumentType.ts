import { Node } from './Node';
import { ChildNode, extendChildNode } from './ChildNode';
import { isEqualConstructor, NodeConstants } from './utils';

export interface DocumentType extends Node, ChildNode {}

/**
 * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType} on MDN
 */
export class DocumentType extends Node {
  readonly nodeType: number = NodeConstants.DOCUMENT_TYPE_NODE;
  readonly nodeName: string;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType.name} on MDN
   */
  readonly name: string;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType.publicId} on MDN
   */
  readonly publicId: string;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType.systemId} on MDN
   */
  readonly systemId: string;

  /**
   * Creates a new instance of {@linkcode DocumentType}.
   */
  constructor(name: string, publicId = '', systemId = '') {
    super();
    this.nodeName = this.name = name;
    this.publicId = publicId;
    this.systemId = systemId;
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return (
      isEqualConstructor(this, otherNode) &&
      this.name === otherNode.name &&
      this.publicId === otherNode.publicId &&
      this.systemId === otherNode.systemId
    );
  }

  cloneNode(deep?: boolean): DocumentType {
    return new DocumentType(this.name, this.publicId, this.systemId);
  }
}

extendChildNode(DocumentType);
