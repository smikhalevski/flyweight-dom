import { CharacterData } from './CharacterData';
import { Constructor, defineProperty, extendsClass } from './utils';
import { NodeType } from './NodeType';
import { uncheckedAppendChild, uncheckedInsertBefore } from './unchecked';

/**
 * @internal
 */
export interface Text extends CharacterData {
  readonly wholeText: string;

  splitText(offset: number): this;
}

/**
 * @internal
 */
export class Text {
  constructor(data?: string) {
    CharacterData.call(this, NodeType.TEXT_NODE, '#text', data);
  }
}

const prototype = extendsClass(Text, CharacterData);

defineProperty(prototype, 'wholeText', {
  get() {
    const { nodeType } = this;

    let text = this;

    for (let node = text.previousSibling; node && node.nodeType === nodeType; node = node.previousSibling) {
      text = node as Text;
    }

    let str = '';

    for (let node: Text | null = text; node && node.nodeType === nodeType; node = node.nextSibling as Text) {
      str += node.data;
    }

    return str;
  },
});

prototype.splitText = function (offset) {
  const { data, parentNode, nextSibling } = this;

  this.data = data.substring(0, offset);

  const node = new (this.constructor as Constructor<Text>)(data.substring(offset));

  if (parentNode) {
    if (nextSibling) {
      uncheckedInsertBefore(parentNode, node, nextSibling);
    } else {
      uncheckedAppendChild(parentNode, node);
    }
  }
  return node;
};
