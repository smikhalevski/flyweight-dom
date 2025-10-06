import type { ParentNode } from './ParentNode.js';
import type { Node } from './Node.js';
import { CharacterData } from './CharacterData.js';
import { uncheckedAppendChild } from './uncheckedAppendChild.js';
import { uncheckedInsertBefore } from './uncheckedInsertBefore.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { TEXT_NODE } from './utils.js';

/**
 * @see [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) on MDN
 * @group Nodes
 */
export class Text extends CharacterData {
  readonly nodeType: number = TEXT_NODE;
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

    const node = new (this.constructor as typeof Text)(data.substring(offset)) as this;

    if (parentNode === null) {
      return node;
    }

    if (nextSibling !== null) {
      uncheckedInsertBefore(parentNode, node, nextSibling);
    } else {
      uncheckedAppendChild(parentNode, node);
    }
    return node;
  }
}

export function setTextContent(node: ParentNode, value: string | null): void {
  while (node.firstChild !== null) {
    uncheckedRemoveChild(node, node.firstChild);
  }

  if (value !== null && value.length !== 0) {
    uncheckedAppendChild(node, new Text(value));
  }
}

export function getTextContent(node: Node): string {
  let value = '';

  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    value += child.textContent;
  }

  return value;
}
