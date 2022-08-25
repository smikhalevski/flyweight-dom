import { CharacterData } from './CharacterData';
import { createPrototype, defineProperty } from './utils';
import { NodeType } from './NodeType';
import { uncheckedAppendChild, uncheckedInsertBefore } from './node-utils';

export interface Text extends CharacterData {
  readonly wholeText: string;

  splitText(offset: number): Text;
}

export class Text {
  constructor(data?: string) {
    CharacterData.call(this, NodeType.TEXT_NODE, data);
  }
}

const prototype: Text = (Text.prototype = createPrototype(CharacterData.prototype));

defineProperty(prototype, 'wholeText', {
  get(this: Text): Text['wholeText'] {
    let text = this;

    for (let node = text.previousSibling; node && node.nodeType === NodeType.TEXT_NODE; node = node.previousSibling) {
      text = node as Text;
    }

    let str = '';

    for (let node: Text | null = text; node && node.nodeType === NodeType.TEXT_NODE; node = node.nextSibling as Text) {
      str += node.data;
    }

    return str;
  },
});

prototype.splitText = function (offset) {
  const { data, parentNode, nextSibling } = this;

  this.data = data.substring(0, offset);

  const node = new Text(data.substring(offset));

  if (parentNode) {
    if (nextSibling) {
      uncheckedInsertBefore(parentNode, node, nextSibling);
    } else {
      uncheckedAppendChild(parentNode, node);
    }
  }
  return node;
};

prototype.cloneNode = function () {
  return new Text(this.data);
};
