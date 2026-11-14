import { CharacterData } from './CharacterData.ts';
import { Node } from './Node.ts';
import {
  defineNodeType,
  isEqualConstructor as importedIsEqualConstructor,
  PROCESSING_INSTRUCTION_NODE,
  retainHiddenClasses,
} from './utils.ts';

// V8 checks an imported function at every call, but inlines a local constant without a check
const isEqualConstructor = importedIsEqualConstructor;

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

retainHiddenClasses(new ProcessingInstruction(''));
