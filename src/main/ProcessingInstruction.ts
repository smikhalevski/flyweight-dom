import { CharacterData } from './CharacterData';
import { extendsClass } from './utils';
import { NodeType } from './NodeType';

export interface ProcessingInstruction extends CharacterData {}

export class ProcessingInstruction {
  readonly target: string;

  constructor(target: string, data?: string) {
    CharacterData.call(this, NodeType.PROCESSING_INSTRUCTION_NODE, target, data);

    this.target = target;
  }
}

const prototype = extendsClass(ProcessingInstruction, CharacterData);

prototype.cloneNode = function () {
  return new ProcessingInstruction(this.target, this.data);
};
