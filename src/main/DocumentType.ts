import type { Node } from './Node.js';
import { ChildNode } from './ChildNode.js';
import { DOCUMENT_TYPE_NODE, isEqualConstructor } from './utils.js';

/**
 * @see [DocumentType](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
 * @group Nodes
 */
export class DocumentType extends ChildNode() {
  readonly nodeType: number = DOCUMENT_TYPE_NODE;
  readonly nodeName: string;

  /**
   * Creates a new instance of {@link DocumentType}.
   */
  constructor(
    /**
     * @see [DocumentType.name](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
     */
    readonly name: string,
    /**
     * @see [DocumentType.publicId](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
     */
    readonly publicId = '',
    /**
     * @see [DocumentType.systemId](https://developer.mozilla.org/en-US/docs/Web/API/DocumentType) on MDN
     */
    readonly systemId = ''
  ) {
    super();
    this.nodeName = name;
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
