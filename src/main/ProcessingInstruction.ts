import { CharacterData } from './CharacterData.js';
import { Node } from './Node.js';
import { defineNodeType, isEqualConstructor, PROCESSING_INSTRUCTION_NODE } from './utils.js';

/**
 * @see [ProcessingInstruction](https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction) on MDN
 * @group Nodes
 */
export class ProcessingInstruction extends CharacterData {
  readonly target: string;

  /**
   * Creates a new instance of {@link ProcessingInstruction}.
   */
  constructor(target: string, data?: string) {
    super(data);
    this.target = target;
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor(this, otherNode) && this.target === otherNode.target && this.data === otherNode.data;
  }

  cloneNode(deep?: boolean): ProcessingInstruction {
    return new (this.constructor as typeof ProcessingInstruction)(this.target, this.data);
  }
}

defineNodeType(ProcessingInstruction, PROCESSING_INSTRUCTION_NODE, node => node.target);
