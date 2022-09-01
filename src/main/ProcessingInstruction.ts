import { CharacterData } from './CharacterData';
import { extendClass } from './utils';
import { NodeType } from './NodeType';
import { constructCharacterData } from './constructCharacterData';

export interface ProcessingInstruction extends CharacterData {}

export class ProcessingInstruction {
  readonly target: string;

  constructor(target: string, data?: string) {
    constructCharacterData(this, NodeType.PROCESSING_INSTRUCTION_NODE, target, data);

    this.target = target;
  }
}

const prototype = extendClass(ProcessingInstruction, CharacterData);

prototype.cloneNode = function () {
  return new ProcessingInstruction(this.target, this.data);
};
