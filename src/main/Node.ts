import type { ChildNode } from './ChildNode.ts';
import type { Element } from './Element.ts';
import { EmptyNodeList, type ChildrenCache, type NodeList } from './NodeList.ts';
import type { ParentNode } from './ParentNode.ts';
import { uncheckedContains } from './uncheckedContains.ts';
import { isElement, isEqualChildNodes, isEqualConstructor } from './utils.ts';

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
   * `true` if the node can have children. Defined on prototypes, so the constructor knows which fields to initialize.
   *
   * @hidden
   */
  declare protected readonly _isParentNode: boolean;

  /**
   * Backs {@link ParentNode.childNodes}.
   *
   * **Note:** Initialized for parent nodes only, see the constructor.
   *
   * @hidden
   */
  declare protected _childNodes: NodeList | undefined;

  /**
   * Backs {@link ParentNode.children}.
   *
   * **Note:** Initialized for parent nodes only, see the constructor.
   *
   * @hidden
   */
  declare protected _children: NodeList<Element> | undefined;

  /**
   * The cache of live lists of children, or the version of children if there's no cache, or `null` if children changed
   * since either was set. Live lists and iterators compare versions to tell whether children changed.
   *
   * The cache lives on the node rather than on lists, so dropping it when children change also releases the cached
   * node. Otherwise, a removed child would stay in memory until the list is read again.
   *
   * **Note:** Initialized for parent nodes only, see the constructor.
   *
   * @hidden
   */
  declare protected _childrenCache: ChildrenCache | number | null;

  /**
   * Creates a new instance of {@link Node}.
   */
  constructor() {
    // Parent node fields are initialized here rather than in ParentNode, since a mixin with field initializers gets a
    // constructor that V8 can't skip, which makes every parent node slower to create. Leaf nodes don't get these
    // fields, so they don't spend memory on them. Fields are initialized on construction rather than on first access,
    // so creating a list doesn't change the hidden class of the node.
    if (this._isParentNode) {
      this._childNodes = undefined;
      this._children = undefined;
      this._childrenCache = null;
    }
  }

  /**
   * @see [Node.nodeValue](https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue) on MDN
   */
  get nodeValue(): string | null {
    return null;
  }

  set nodeValue(value: string | null | undefined) {}

  /**
   * @see [Node.textContent](https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent) on MDN
   */
  get textContent(): string | null {
    return null;
  }

  set textContent(value: string | null | undefined) {}

  /**
   * @see [Node.childNodes](https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes) on MDN
   */
  get childNodes(): NodeList {
    return emptyNodeList;
  }

  /**
   * @see [Node.parentElement](https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement) on MDN
   */
  get parentElement(): Element | null {
    const { parentNode } = this;

    return parentNode !== null && isElement(parentNode) ? parentNode : null;
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

  /**
   * Notifies live lists and iterators of the node that its children changed.
   *
   * @hidden
   */
  protected _notifyChildrenChanged(): void {
    // Dropping the cache rather than updating it keeps this a single store, and releases the node that the cache holds
    this._childrenCache = null;
  }
}

Object.defineProperty(Node.prototype, '_isParentNode', { value: false });

/**
 * {@link Node.childNodes} of all nodes that can't have children. The list has no state, so all nodes share it, and it
 * is frozen, so a property added to it doesn't show up on other nodes.
 */
const emptyNodeList: NodeList = Object.freeze(new EmptyNodeList());
