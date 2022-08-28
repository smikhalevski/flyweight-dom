import { CharacterData } from './CharacterData';
import { extendsClass } from './utils';
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

const prototype = extendsClass(ProcessingInstruction, CharacterData);

prototype.cloneNode = function () {
  return new ProcessingInstruction(this.target, this.data);
};
