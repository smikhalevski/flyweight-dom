import { CharacterData } from './CharacterData';
import { extendClass, isEqualConstructor, NodeType } from './utils';

export interface ProcessingInstruction extends CharacterData {}

export class ProcessingInstruction {
  readonly target: string;

  constructor(target: string, data = '') {
    this.nodeName = this.target = target;
    this.data = data;
  }
}

const prototype = extendClass(ProcessingInstruction, CharacterData, {
  nodeType: { value: NodeType.PROCESSING_INSTRUCTION_NODE },
});

prototype.isEqualNode = function (otherNode) {
  return isEqualConstructor(this, otherNode) && this.target === otherNode.target && this.data === otherNode.data;
};

prototype.cloneNode = function () {
  return new ProcessingInstruction(this.target, this.data);
};
