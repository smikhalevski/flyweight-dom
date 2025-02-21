import { Node } from './Node';
import { CharacterData } from './CharacterData';
import { isEqualConstructor, NodeConstants } from './utils';

/**
 * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction ProcessingInstruction} on MDN
 */
export class ProcessingInstruction extends CharacterData {
  readonly nodeType: number = NodeConstants.PROCESSING_INSTRUCTION_NODE;
  readonly nodeName: string;
  readonly target: string;

  /**
   * Creates a new instance of {@linkcode ProcessingInstruction}.
   */
  constructor(target: string, data = '') {
    super();
    this.nodeName = this.target = target;
    this.data = data;
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor(this, otherNode) && this.target === otherNode.target && this.data === otherNode.data;
  }

  cloneNode(deep?: boolean): ProcessingInstruction {
    return new ProcessingInstruction(this.target, this.data);
  }
}
