import type { ChildNode } from './ChildNode.ts';
import type { Element } from './Element.ts';
import { lookupNamespaceURI } from './lookupNamespaceURI.ts';
import { lookupPrefix } from './lookupPrefix.ts';
import { EmptyNodeList, type ChildrenCache, type NodeList } from './NodeList.ts';
import type { ParentNode } from './ParentNode.ts';
import { uncheckedCompareDocumentPosition } from './uncheckedCompareDocumentPosition.ts';
import { uncheckedContains } from './uncheckedContains.ts';
import {
  DOCUMENT_POSITION_DISCONNECTED,
  DOCUMENT_POSITION_FOLLOWING,
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
  DOCUMENT_POSITION_PRECEDING,
  isElement as importedIsElement,
  isEqualChildNodes as importedIsEqualChildNodes,
  isEqualConstructor as importedIsEqualConstructor,
  retainHiddenClasses,
} from './utils.ts';

// V8 checks an imported function at every call, but inlines a local constant without a check
const isElement = importedIsElement;
const isEqualChildNodes = importedIsEqualChildNodes;
const isEqualConstructor = importedIsEqualConstructor;

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

  static readonly DOCUMENT_POSITION_DISCONNECTED: number = 1 << 0;
  static readonly DOCUMENT_POSITION_PRECEDING: number = 1 << 1;
  static readonly DOCUMENT_POSITION_FOLLOWING: number = 1 << 2;
  static readonly DOCUMENT_POSITION_CONTAINS: number = 1 << 3;
  static readonly DOCUMENT_POSITION_CONTAINED_BY: number = 1 << 4;
  static readonly DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC: number = 1 << 5;

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
  contains(otherNode: Node | null | undefined): boolean {
    return otherNode !== null && otherNode !== undefined && uncheckedContains(this, otherNode);
  }

  /**
   * Returns the root of the tree that the node is in, which is the node itself if it has no parent.
   *
   * @see [Node.getRootNode](https://developer.mozilla.org/en-US/docs/Web/API/Node/getRootNode) on MDN
   */
  getRootNode(): Node {
    let node: Node = this;

    while (node.parentNode !== null) {
      node = node.parentNode;
    }
    return node;
  }

  /**
   * Returns bits that tell the position of the other node relative to this node: whether it precedes or follows this
   * node, and whether it contains this node or is contained by it.
   *
   * Nodes of different trees have no position, so {@link DOCUMENT_POSITION_DISCONNECTED} is returned along with a
   * preceding or following bit that is the same for all nodes of both trees, so nodes can be sorted.
   *
   * @param otherNode The node to compare with.
   * @see [Node.compareDocumentPosition](https://developer.mozilla.org/en-US/docs/Web/API/Node/compareDocumentPosition) on MDN
   */
  compareDocumentPosition(otherNode: Node): number {
    const position = uncheckedCompareDocumentPosition(this, otherNode);

    if (position !== DOCUMENT_POSITION_DISCONNECTED) {
      return position;
    }

    return (
      DOCUMENT_POSITION_DISCONNECTED |
      DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
      (getTreeIndex(otherNode) < getTreeIndex(this) ? DOCUMENT_POSITION_PRECEDING : DOCUMENT_POSITION_FOLLOWING)
    );
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
   * Returns the namespace that the prefix is bound to at this node, or `null` if the prefix isn't bound.
   *
   * @param prefix The prefix to look up, or `null` to look up the default namespace.
   * @see [Node.lookupNamespaceURI](https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupNamespaceURI) on MDN
   */
  lookupNamespaceURI(prefix: string | null | undefined): string | null {
    return lookupNamespaceURI(this, prefix);
  }

  /**
   * Returns a prefix that is bound to the namespace at this node, or `null` if there's no such prefix.
   *
   * @param namespaceURI The namespace to look up.
   * @see [Node.lookupPrefix](https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupPrefix) on MDN
   */
  lookupPrefix(namespaceURI: string | null | undefined): string | null {
    return lookupPrefix(this, namespaceURI);
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

retainHiddenClasses(new Node());

/**
 * Indices of roots of trees in the order in which nodes of trees were compared for the first time. Trees have no order
 * of their own, but nodes of different trees must be compared the same way each time, see
 * {@link Node.compareDocumentPosition}. The map is weak, so it doesn't keep roots in memory.
 */
const treeIndexMap = new WeakMap<Node, number>();

/**
 * The number of trees in {@link treeIndexMap}, since a weak map doesn't count its entries.
 */
let treeCount = 0;

/**
 * Returns the index of the tree that the node is in, see {@link treeIndexMap}.
 */
const getTreeIndex = (node: Node): number => {
  const root = node.getRootNode();

  let index = treeIndexMap.get(root);

  if (index === undefined) {
    index = treeCount++;
    treeIndexMap.set(root, index);
  }

  return index;
};

/**
 * {@link Node.childNodes} of all nodes that can't have children. The list has no state, so all nodes share it, and it
 * is frozen, so a property added to it doesn't show up on other nodes.
 */
const emptyNodeList: NodeList = Object.freeze(new EmptyNodeList());
