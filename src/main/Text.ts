import { CharacterData } from './CharacterData';
import { Constructor, defineProperty, extendClass } from './utils';
import { NodeType } from './NodeType';
import { constructCharacterData } from './constructCharacterData';

export interface Text extends CharacterData {
  readonly wholeText: string;

  splitText(offset: number): this;
}

export class Text {
  constructor(data?: string) {
    constructCharacterData(this, NodeType.TEXT_NODE, '#text', data);
  }
}

const prototype = extendClass(Text, CharacterData);

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

  const node = new (this.constructor as Constructor<Text>)(data.substring(offset));

  if (parentNode != null) {
    if (nextSibling != null) {
      parentNode.insertBefore(node, nextSibling);
    } else {
      parentNode.appendChild(node);
    }
  }
  return node;
};
