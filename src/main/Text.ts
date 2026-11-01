import { CharacterData } from './CharacterData.js';
import type { ChildNode } from './ChildNode.js';
import type { Node } from './Node.js';
import type { ParentNode } from './ParentNode.js';
import { uncheckedAppendChild } from './uncheckedAppendChild.js';
import { uncheckedInsertBefore } from './uncheckedInsertBefore.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import {
  defineNodeType,
  ELEMENT_NODE,
  isText,
  TEXT_NODE,
  coerceToString,
  coerceToNonNegativeInteger,
} from './utils.js';

/**
 * @see [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) on MDN
 * @group Nodes
 */
export class Text extends CharacterData {
  /**
   * @see [Text.wholeText](https://developer.mozilla.org/en-US/docs/Web/API/Text/wholeText) on MDN
   */
  get wholeText(): string {
    let text: Text = this;

    // CDATASection is a Text too, so adjacent text and CDATA sections are joined
    for (let node = this.previousSibling; node !== null && isText(node); node = node.previousSibling) {
      text = node;
    }

    let str = '';

    for (let node: ChildNode | null = text; node !== null && isText(node); node = node.nextSibling) {
      str += node.data;
    }

    return str;
  }

  /**
   * @see [Text.splitText](https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText) on MDN
   */
  splitText(offset: number): this {
    const { data, parentNode, nextSibling } = this;

    offset = coerceToNonNegativeInteger(offset);

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

defineNodeType(Text, TEXT_NODE, '#text');

export function setTextContent(node: ParentNode, value: string | null | undefined): void {
  while (node.firstChild !== null) {
    uncheckedRemoveChild(node, node.firstChild);
  }

  const data = coerceToString(value);

  if (data.length !== 0) {
    uncheckedAppendChild(node, new Text(data));
  }
}

/**
 * Returns the concatenated data of all text descendants, ignoring comments, processing instructions and doctypes.
 */
export function getTextContent(node: Node): string {
  let value = '';

  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (isText(child)) {
      value += child.data;
    } else if (child.nodeType === ELEMENT_NODE) {
      value += getTextContent(child);
    }
  }

  return value;
}
