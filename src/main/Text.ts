import { CharacterData } from './CharacterData';
import { Constructor, defineProperty, extendClass } from './utils';
import { NodeType } from './NodeType';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { uncheckedInsertBefore } from './uncheckedInsertBefore';

export interface Text extends CharacterData {
  // public readonly
  wholeText: string;

  splitText(offset: number): this;
}

export class Text {
  constructor(data = '') {
    this.data = data;
  }
}

const prototype = extendClass(Text, CharacterData);

prototype.nodeType = NodeType.TEXT_NODE;
prototype.nodeName = '#text';

defineProperty(prototype, 'wholeText', {
  get() {
    const { nodeType } = this;

    let text = this;

    for (let node = text.previousSibling; node != null && node.nodeType === nodeType; node = node.previousSibling) {
      text = node as Text;
    }

    let str = '';

    for (let node: Text | null = text; node != null && node.nodeType === nodeType; node = node.nextSibling as Text) {
      str += node.data;
    }

    return str;
  },
});

prototype.splitText = function (offset) {
  const { data, parentNode, nextSibling } = this;

  this.data = data.substring(0, offset);

  const node = new (this.constructor as Constructor)(data.substring(offset));

  if (parentNode != null) {
    if (nextSibling != null) {
      uncheckedInsertBefore(parentNode, node, nextSibling);
    } else {
      uncheckedAppendChild(parentNode, node);
    }
  }
  return node;
};
