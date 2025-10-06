import type { Element } from './Element.js';
import type { ChildNode } from './ChildNode.js';
import type { ParentNode } from './ParentNode.js';
import { ELEMENT_NODE, isEqualChildNodes, isEqualConstructor } from './utils.js';
import { uncheckedContains } from './uncheckedContains.js';
import { NodeList } from './NodeList.js';

/**
 * @see [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) on MDN
 * @group Nodes
 */
export class Node {
  static readonly ELEMENT_NODE: number = 1;
  static readonly ATTRIBUTE_NODE: number = 2;
  static readonly TEXT_NODE: number = 3;
  static readonly CDATA_SECTION_NODE: number = 4;
  static readonly PROCESSING_INSTRUCTION_NODE: number = 7;
  static readonly COMMENT_NODE: number = 8;
  static readonly DOCUMENT_NODE: number = 9;
  static readonly DOCUMENT_TYPE_NODE: number = 10;
  static readonly DOCUMENT_FRAGMENT_NODE: number = 11;

  /**
   * @see [Node.nodeType](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType) on MDN
   */
  declare readonly nodeType: number;

  /**
   * @see [Node.nodeName](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName) on MDN
   */
  declare readonly nodeName: string;

  /**
   * @see [Node.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode) on MDN
   *
   * @readonly
   */
  parentNode: ParentNode | null = null;

  /**
   * @see [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling) on MDN
   *
   * @readonly
   */
  previousSibling: ChildNode | null = null;

  /**
   * @see [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling) on MDN
   *
   * @readonly
   */
  nextSibling: ChildNode | null = null;

  /**
   * @see [Node.firstChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild) on MDN
   *
   * @readonly
   */
  firstChild: ChildNode | null = null;

  /**
   * @see [Node.lastChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild) on MDN
   *
   * @readonly
   */
  lastChild: ChildNode | null = null;

  /**
   * @see [Node.nodeValue](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue) on MDN
   */
  get nodeValue(): string | null {
    return null;
  }

  set nodeValue(value: string | null) {}

  /**
   * @see [Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) on MDN
   */
  get textContent(): string | null {
    return null;
  }

  set textContent(value: string | null) {}

  /**
   * @see [Node.childNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes) on MDN
   */
  get childNodes(): NodeList {
    return Object.defineProperty(this, 'childNodes', { value: new NodeList(this) }).childNodes;
  }

  /**
   * @see [Node.parentElement](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement) on MDN
   */
  get parentElement(): Element | null {
    let parent = this.parentNode;

    while (parent !== null && parent.nodeType !== ELEMENT_NODE) {
      parent = parent.parentNode;
    }

    return parent as Element | null;
  }

  /**
   * @see [Node.hasChildNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes) on MDN
   */
  hasChildNodes(): boolean {
    return this.firstChild !== null;
  }

  /**
   * @see [Node.appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) on MDN
   */
  appendChild<T extends Node>(node: T): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * @see [Node.insertBefore](https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore) on MDN
   */
  insertBefore<T extends Node>(node: T, child: Node | null | undefined): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * @see [Node.contains](https://developer.mozilla.org/en-US/docs/Web/API/Node/contains) on MDN
   */
  contains(node: Node | null | undefined): boolean {
    return node !== null && node !== undefined && uncheckedContains(this, node);
  }

  /**
   * @see [Node.removeChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild) on MDN
   */
  removeChild<T extends Node>(child: T): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * @see [Node.replaceChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild) on MDN
   */
  replaceChild<T extends Node>(node: Node, child: T): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * @see [Node.isEqualNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode) on MDN
   */
  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor(this, otherNode) && isEqualChildNodes(this, otherNode);
  }

  /**
   * @see [Node.cloneNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode) on MDN
   */
  cloneNode(deep?: boolean): Node {
    throw new Error('This node type does not support this method');
  }
}
