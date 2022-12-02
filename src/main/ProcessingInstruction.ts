import { CharacterData } from './CharacterData';
import { extendClass } from './utils';
import { NodeType } from './NodeType';

export interface ProcessingInstruction extends CharacterData {}

export class ProcessingInstruction {
  readonly target: string;

  constructor(target: string, data = '') {
    this.nodeName = this.target = target;
    this.data = data;
  }
}

const prototype = extendClass(ProcessingInstruction, CharacterData);

prototype.nodeType = NodeType.PROCESSING_INSTRUCTION_NODE;

prototype.cloneNode = function () {
  return new ProcessingInstruction(this.target, this.data);
};
