import type { ChildNode } from './ChildNode.js';
import type { Node } from './Node.js';

/**
 * @see [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) on MDN
 * @group Other
 */
export abstract class NodeList<T extends ChildNode = ChildNode> implements Iterable<T> {
  [index: number]: T;

  /**
   * @see [NodeList.length](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/length) on MDN
   */
  abstract readonly length: number;

  /**
   * @see [NodeList.item](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/item) on MDN
   */
  abstract item(index: number): T | null;

  /**
   * @see [NodeList.values](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/values) on MDN
   */
  abstract values(): IterableIterator<T>;

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
  }
}

/**
 * The {@link NodeList} of a node that can't have children. It doesn't use a Proxy, since there are no indices to
 * resolve, so creating and reading it costs as little as an ordinary object.
 *
 * @group Other
 */
export class EmptyNodeList<T extends ChildNode = ChildNode> extends NodeList<T> {
  get length(): number {
    return 0;
  }

  item(index: number): T | null {
    return null;
  }

  *values(): IterableIterator<T> {}
}

/**
 * The live {@link NodeList} of children of a node. Index access goes through a Proxy, since the list doesn't store
 * nodes, and reads them from the root on each access.
 *
 * The list caches its length and the last accessed node, so iterating by index takes constant time per access until
 * children of the root change.
 *
 * @group Other
 */
export class ChildNodeList<T extends ChildNode = ChildNode> extends NodeList<T> {
  private _root;
  private _filter;

  /**
   * The children version of the root when the cache was filled, or -1 if the cache was never filled.
   */
  private _rootChildrenVersion = -1;

  /**
   * The cached length, or -1 if it isn't known.
   */
  private _length = -1;

  /**
   * The index of {@link _node}, or -1 if no node is cached.
   */
  private _index = -1;

  /**
   * The last node returned by {@link item}.
   */
  private _node: T | null = null;

  /**
   * The list itself rather than its {@link Proxy}.
   */
  private _target: ChildNodeList<T>;

  /**
   * Creates a new instance of {@link ChildNodeList}.
   *
   * @param root The node whose children the list contains.
   * @param filter The callback that returns `true` for children that the list contains, or `undefined` if the list
   * contains all children.
   */
  constructor(root: Node, filter?: (node: Node) => node is T) {
    super();
    this._root = root;
    this._filter = filter;
    this._target = this;

    return new Proxy<ChildNodeList<T>>(this, proxyHandler);
  }

  get length(): number {
    this._dropStaleCache();

    const { _target } = this;
    const { _filter } = _target;

    if (_target._length !== -1) {
      return _target._length;
    }

    let length = 0;

    for (let child = _target._root.firstChild; child !== null; child = child.nextSibling) {
      if (_filter === undefined || _filter(child)) {
        ++length;
      }
    }

    _target._length = length;

    return length;
  }

  item(index: number): T | null {
    const { _target } = this;

    _target._dropStaleCache();

    if (!Number.isSafeInteger(index) || index < 0 || (_target._length !== -1 && index >= _target._length)) {
      return null;
    }

    const { _filter } = _target;

    let i = _target._index;
    let node = _target._node;

    // Starts from the first child if it's closer than the cached node
    if (i === -1 || index < i - index) {
      i = 0;
      node = getFilteredSibling(_target._root.firstChild, _filter, true) as T | null;
    }

    while (i < index && node !== null) {
      node = getFilteredSibling(node.nextSibling, _filter, true) as T | null;
      ++i;
    }

    if (node === null) {
      return null;
    }

    while (i > index) {
      node = getFilteredSibling(node.previousSibling, _filter, false) as T;
      --i;
    }

    _target._index = i;
    _target._node = node;

    return node;
  }

  *values(): IterableIterator<T> {
    const { _target } = this;

    for (let index = 0, node; (node = _target.item(index)) !== null; ++index) {
      yield node;
    }
  }

  /**
   * Drops the cache if children of the root changed since it was filled.
   */
  private _dropStaleCache(): void {
    const { _target } = this;

    const rootChildrenVersion = _target._root['_childrenVersion'];

    if (_target._rootChildrenVersion === rootChildrenVersion) {
      return;
    }

    _target._rootChildrenVersion = rootChildrenVersion;
    _target._length = -1;
    _target._index = -1;
    _target._node = null;
  }
}

/**
 * Returns the node or its closest sibling in the given direction that passes the filter.
 */
function getFilteredSibling(
  node: ChildNode | null,
  filter: ((node: Node) => boolean) | undefined,
  isForward: boolean
): ChildNode | null {
  while (node !== null && filter !== undefined && !filter(node)) {
    node = isForward ? node.nextSibling : node.previousSibling;
  }
  return node;
}

function parseArrayIndex(key: string | symbol): number {
  if (typeof key !== 'string' || key.length === 0) {
    return -1;
  }

  let charCode = key.charCodeAt(0);

  if (charCode === /* 0 */ 48) {
    return key.length === 1 ? 0 : -1;
  }

  let index = 0;

  for (let i = 0; i < key.length; ++i) {
    charCode = key.charCodeAt(i);

    if (charCode < /* 0 */ 48 || charCode > /* 9 */ 57) {
      return -1;
    }

    index = index * 10 + charCode - 48;
  }

  return index;
}

const proxyHandler: ProxyHandler<ChildNodeList> = {
  get(target, key, _receiver) {
    if (key === '_target') {
      return target['_target'];
    }

    const index = parseArrayIndex(key);

    if (index !== -1) {
      // Unlike item(), an out-of-range index returns undefined, the same as in browsers
      return target.item(index) ?? undefined;
    }

    return target[key as keyof ChildNodeList];
  },

  has(target, key) {
    const index = parseArrayIndex(key);

    if (index !== -1) {
      return index < target.length;
    }

    return key in target;
  },
};
