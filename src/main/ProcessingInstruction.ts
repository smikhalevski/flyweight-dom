import { Node } from './Node';
import { CharacterData } from './CharacterData';
import { isEqualConstructor } from './utils';

/**
 * @see [ProcessingInstruction](https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction) on MDN
 * @group Nodes
 */
export class ProcessingInstruction extends CharacterData {
  readonly nodeType: number = Node.PROCESSING_INSTRUCTION_NODE;
  readonly nodeName: string;
  readonly target: string;

  /**
   * Creates a new instance of {@link ProcessingInstruction}.
   */
  constructor(target: string, data?: string) {
    super(data);
    this.nodeName = this.target = target;
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor(this, otherNode) && this.target === otherNode.target && this.data === otherNode.data;
  }

  cloneNode(deep?: boolean): ProcessingInstruction {
    return new ProcessingInstruction(this.target, this.data);
  }
}
