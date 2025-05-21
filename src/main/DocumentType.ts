import { Node } from './Node.js';
import { ChildNode, extendChildNode } from './ChildNode.js';
import { isEqualConstructor } from './utils.js';

/**
 * @group Nodes
 */
export interface DocumentType extends ChildNode {}

/**
 * @see [DocumentType](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
 * @group Nodes
 */
export class DocumentType extends Node {
  readonly nodeType: number = Node.DOCUMENT_TYPE_NODE;
  readonly nodeName: string;

  /**
   * @see [DocumentType.name](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
   */
  readonly name: string;

  /**
   * @see [DocumentType.publicId](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
   */
  readonly publicId: string;

  /**
   * @see [DocumentType.systemId](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
   */
  readonly systemId: string;

  /**
   * Creates a new instance of {@link DocumentType}.
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
