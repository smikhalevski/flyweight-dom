import { Element } from './Element';
import { die, isEqualChildNodes, isEqualConstructor, NodeConstants } from './utils';
import { ChildNode } from './ChildNode';
import { ParentNode } from './ParentNode';
import { uncheckedContains } from './uncheckedContains';

/**
 * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node Node} on MDN
 */
export abstract class Node {
  static readonly ELEMENT_NODE: number = NodeConstants.ELEMENT_NODE;
  static readonly ATTRIBUTE_NODE: number = NodeConstants.ATTRIBUTE_NODE;
  static readonly TEXT_NODE: number = NodeConstants.TEXT_NODE;
  static readonly CDATA_SECTION_NODE: number = NodeConstants.CDATA_SECTION_NODE;
  static readonly PROCESSING_INSTRUCTION_NODE: number = NodeConstants.PROCESSING_INSTRUCTION_NODE;
  static readonly COMMENT_NODE: number = NodeConstants.COMMENT_NODE;
  static readonly DOCUMENT_NODE: number = NodeConstants.DOCUMENT_NODE;
  static readonly DOCUMENT_TYPE_NODE: number = NodeConstants.DOCUMENT_TYPE_NODE;
  static readonly DOCUMENT_FRAGMENT_NODE: number = NodeConstants.DOCUMENT_FRAGMENT_NODE;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType Node.nodeType} on MDN
   */
  abstract readonly nodeType: number;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName Node.nodeName} on MDN
   */
  abstract readonly nodeName: string;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode Node.parentNode} on MDN
   */
  /* readonly */ parentNode: ParentNode | null = null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling Node.previousSibling} on MDN
   */
  /* readonly */ previousSibling: ChildNode | null = null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling Node.nextSibling} on MDN
   */
  /* readonly */ nextSibling: ChildNode | null = null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild Node.firstChild} on MDN
   */
  /* readonly */ firstChild: ChildNode | null = null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild Node.lastChild} on MDN
   */
  /* readonly */ lastChild: ChildNode | null = null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue Node.nodeValue} on MDN
   */
  declare nodeValue: string | null;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent Node.textContent} on MDN
   */
  declare textContent: string | null;

  protected _childNodes: ChildNode[] | undefined = undefined;

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes Node.childNodes} on MDN
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
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement Node.parentElement} on MDN
   */
  get parentElement(): Element | null {
    let parent = this.parentNode;

    while (parent !== null && parent.nodeType !== NodeConstants.ELEMENT_NODE) {
      parent = parent.parentNode;
    }
    return parent as Element | null;
  }

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes Node.hasChildNodes} on MDN
   */
  hasChildNodes(): boolean {
    return this.firstChild !== null;
  }

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild Node.appendChild} on MDN
   */
  appendChild<T extends Node>(node: T): T {
    unsupported();
  }

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore Node.insertBefore} on MDN
   */
  insertBefore<T extends Node>(node: T, child: Node | null | undefined): T {
    unsupported();
  }

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/contains Node.contains} on MDN
   */
  contains(node: Node | null | undefined): boolean {
    return node !== null && node !== undefined ? uncheckedContains(this, node) : false;
  }

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild Node.removeChild} on MDN
   */
  removeChild<T extends Node>(child: T): T {
    unsupported();
  }

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild Node.replaceChild} on MDN
   */
  replaceChild<T extends Node>(node: Node, child: T): T {
    unsupported();
  }

  /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode Node.isEqualNode} on MDN
   */
  isEqualNode(otherNode: Node | null | undefined): boolean {
    return isEqualConstructor(this, otherNode) && isEqualChildNodes(this, otherNode);
  }

  /**
   /**
   * **See** {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode Node.cloneNode} on MDN
   */
  cloneNode(deep?: boolean): Node {
    unsupported();
  }
}

Node.prototype.nodeValue = null;
Node.prototype.textContent = null;

function unsupported(): never {
  die('This node type does not support this method');
}
