import { CharacterData } from './CharacterData';
import { createPrototype } from './utils';
import { NodeType } from './NodeType';

export interface ProcessingInstruction extends CharacterData {}

export class ProcessingInstruction {
  constructor(readonly target: string, data?: string) {
    CharacterData.call(this, NodeType.PROCESSING_INSTRUCTION_NODE, data);
  }
}

ProcessingInstruction.prototype = createPrototype(CharacterData.prototype);
