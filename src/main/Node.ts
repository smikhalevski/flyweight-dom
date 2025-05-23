import { Element } from './Element.js';
import { isEqualChildNodes, isEqualConstructor } from './utils.js';
import { ChildNode } from './ChildNode.js';
import { ParentNode } from './ParentNode.js';
import { uncheckedContains } from './uncheckedContains.js';

/**
 * @see [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) on MDN
 * @group Nodes
 */
export abstract class Node {
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
  abstract readonly nodeType: number;

  /**
   * @see [Node.nodeName](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName) on MDN
   */
  abstract readonly nodeName: string;

  /**
   * @see [Node.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode) on MDN
   *
   * @readonly
   */
  parentNode: ParentNode | null;

  /**
   * @see [Node.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling) on MDN
   *
   * @readonly
   */
  previousSibling: ChildNode | null;

  /**
   * @see [Node.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling) on MDN
   *
   * @readonly
   */
  nextSibling: ChildNode | null;

  /**
   * @see [Node.firstChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild) on MDN
   *
   * @readonly
   */
  firstChild: ChildNode | null;

  /**
   * @see [Node.lastChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild) on MDN
   *
   * @readonly
   */
  lastChild: ChildNode | null;

  declare private _childNodes: ChildNode[] | undefined;
  declare private _children: Element[] | undefined;

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
  get childNodes(): readonly ChildNode[] {
    const nodes: ChildNode[] = [];

    this._childNodes = nodes;

    for (let child = this.firstChild; child !== null; child = child.nextSibling) {
      nodes.push(child);
    }
    Object.defineProperty(this, 'childNodes', { value: nodes });

    return nodes;
  }

  /**
   * @see [Node.parentElement](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement) on MDN
   */
  get parentElement(): Element | null {
    let parent = this.parentNode;

    while (parent !== null && parent.nodeType !== Node.ELEMENT_NODE) {
      parent = parent.parentNode;
    }
    return parent as Element | null;
  }

  constructor() {
    this.parentNode = this.previousSibling = this.nextSibling = this.firstChild = this.lastChild = null;
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
    return node !== null && node !== undefined ? uncheckedContains(this, node) : false;
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
