import { CharacterData } from './CharacterData';
import { Constructor } from './utils';
import { uncheckedAppendChild } from './uncheckedAppendChild';
import { uncheckedInsertBefore } from './uncheckedInsertBefore';
import { Node } from './Node';

/**
 * @see [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) on MDN
 * @group Nodes
 */
export class Text extends CharacterData {
  readonly nodeType: number = Node.TEXT_NODE;
  readonly nodeName: string = '#text';

  /**
   * @see [Text.wholeText](https://developer.mozilla.org/en-US/docs/Web/API/Text/wholeText) on MDN
   */
  get wholeText(): string {
    const { nodeType } = this;

    let text: Text = this;

    for (let node = text.previousSibling; node !== null && node.nodeType === nodeType; node = node.previousSibling) {
      text = node as Text;
    }

    let str = '';

    for (let node: Text | null = text; node !== null && node.nodeType === nodeType; node = node.nextSibling as Text) {
      str += node.data;
    }

    return str;
  }

  /**
   * @see [Text.splitText](https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText) on MDN
   */
  splitText(offset: number): this {
    const { data, parentNode, nextSibling } = this;

    this.data = data.substring(0, offset);

    const node = new (this.constructor as Constructor)(data.substring(offset));

    if (parentNode !== null) {
      if (nextSibling !== null) {
        uncheckedInsertBefore(parentNode, node, nextSibling);
      } else {
        uncheckedAppendChild(parentNode, node);
      }
    }
    return node;
  }
}
