import { CharacterData } from './CharacterData';
import { createPrototype } from './utils';
import { NodeType } from './NodeType';

/**
 * @internal
 */
export interface ProcessingInstruction extends CharacterData {}

/**
 * @internal
 */
export class ProcessingInstruction {
  constructor(readonly target: string, data?: string) {
    CharacterData.call(this, NodeType.PROCESSING_INSTRUCTION_NODE, target, data);
  }
}

ProcessingInstruction.prototype = createPrototype(CharacterData.prototype);
