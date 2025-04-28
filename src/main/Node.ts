import { Element } from './Element';
import { isEqualChildNodes, isEqualConstructor } from './utils';
import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';
import { uncheckedContains } from './uncheckedContains';

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node} on MDN
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
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType Node.nodeType} on MDN
   */
  abstract readonly nodeType: number;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName Node.nodeName} on MDN
   */
  abstract readonly nodeName: string;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode Node.parentNode} on MDN
   *
   * @readonly
   */
  parentNode: ParentNode | null;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling Node.previousSibling} on MDN
   *
   * @readonly
   */
  previousSibling: ChildNode | null;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling Node.nextSibling} on MDN
   *
   * @readonly
   */
  nextSibling: ChildNode | null;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild Node.firstChild} on MDN
   *
   * @readonly
   */
  firstChild: ChildNode | null;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild Node.lastChild} on MDN
   *
   * @readonly
   */
  lastChild: ChildNode | null;

  declare private _childNodes: ChildNode[] | undefined;
  declare private _children: Element[] | undefined;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue Node.nodeValue} on MDN
   */
  get nodeValue(): string | null {
    return null;
  }

  set nodeValue(value: string | null) {}

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent Node.textContent} on MDN
   */
  get textContent(): string | null {
    return null;
  }

  set textContent(value: string | null) {}

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes Node.childNodes} on MDN
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
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement Node.parentElement} on MDN
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
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes Node.hasChildNodes} on MDN
   */
  hasChildNodes(): boolean {
    return this.firstChild !== null;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild Node.appendChild} on MDN
   */
  appendChild<T extends Node>(node: T): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore Node.insertBefore} on MDN
   */
  insertBefore<T extends Node>(node: T, child: Node | null | undefined): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/contains Node.contains} on MDN
   */
  contains(node: Node | null | undefined): boolean {
    return node !== null && node !== undefined ? uncheckedContains(this, node) : false;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild Node.removeChild} on MDN
   */
  removeChild<T extends Node>(child: T): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild Node.replaceChild} on MDN
   */
  replaceChild<T extends Node>(node: Node, child: T): T {
    throw new Error('This node type does not support this method');
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode Node.isEqualNode} on MDN
   */
  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor(this, otherNode) && isEqualChildNodes(this, otherNode);
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode Node.cloneNode} on MDN
   */
  cloneNode(deep?: boolean): Node {
    throw new Error('This node type does not support this method');
  }
}
