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
 * The length and the last accessed node are cached on the root, so iterating by index takes constant time per access
 * until children of the root change.
 *
 * @group Other
 */
export class ChildNodeList<T extends ChildNode = ChildNode> extends NodeList<T> {
  private _root;
  private _filter;

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
    const { _target } = this;
    const { _filter } = _target;
    const cache = getChildrenCache(_target._root, _filter);

    if (cache.length !== -1) {
      return cache.length;
    }

    let length = 0;

    for (let child = _target._root.firstChild; child !== null; child = child.nextSibling) {
      if (_filter === undefined || _filter(child)) {
        ++length;
      }
    }

    cache.length = length;

    return length;
  }

  item(index: number): T | null {
    const { _target } = this;
    const { _filter } = _target;
    const cache = getChildrenCache(_target._root, _filter);

    if (!Number.isInteger(index) || index < 0 || (cache.length !== -1 && index >= cache.length)) {
      return null;
    }

    let i = cache.index;
    let node = cache.node as T | null;

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

    cache.index = i;
    cache.node = node;

    return node;
  }

  values(): IterableIterator<T> {
    const { _target } = this;

    return iterateChildNodes(_target._root, _target._filter);
  }
}

/**
 * The cached length and the last accessed node of a {@link ChildNodeList}. Stored on the root rather than on the list,
 * so the root drops it when its children change, and the cached node isn't kept in memory after it is removed.
 */
export class ChildrenCache {
  /**
   * The number of children that pass the filter, or -1 if it isn't known.
   */
  length = -1;

  /**
   * The index of {@link node}, or -1 if no node is cached.
   */
  index = -1;

  /**
   * The last node returned by {@link ChildNodeList.item}.
   */
  node: ChildNode | null = null;

  /**
   * The cache of lists of filtered children. Set on the cache of lists of all children only.
   */
  filteredCache: ChildrenCache | null = null;

  /**
   * Creates a new instance of {@link ChildrenCache}.
   *
   * @param filter The filter of lists that use the cache, or `undefined` for lists of all children.
   */
  constructor(readonly filter: ((node: Node) => boolean) | undefined) {}
}

/**
 * Returns the cache of lists of children of the parent that pass the filter.
 */
function getChildrenCache(parent: Node, filter: ((node: Node) => boolean) | undefined): ChildrenCache {
  let cache = parent['_childrenCache'];

  // Not an object if children changed, if only iterators read them since then, or if the parent is a leaf node
  if (typeof cache !== 'object' || cache === null) {
    cache = parent['_childrenCache'] = new ChildrenCache(undefined);
  }

  if (filter === undefined) {
    return cache;
  }

  let filteredCache = cache.filteredCache;

  // Lists with different filters take over the cache from each other, so a list with a new filter on each read doesn't
  // grow the cache
  if (filteredCache === null || filteredCache.filter !== filter) {
    filteredCache = cache.filteredCache = new ChildrenCache(filter);
  }
  return filteredCache;
}

/**
 * Yields children of the parent that pass the filter.
 *
 * Children are yielded by index, the same as live lists in browsers, so if children change during iteration, the next
 * yielded node is the one at the next index, and not a sibling of a node that may have been moved to another parent.
 * Doesn't create a {@link ChildNodeList}, so iterating doesn't attach one to every visited parent.
 *
 * @param parent The node whose children are yielded.
 * @param filter The callback that returns `true` for children that are yielded, or `undefined` to yield all children.
 */
export function* iterateChildNodes<T extends ChildNode>(
  parent: Node,
  filter: ((node: Node) => boolean) | undefined
): Generator<T, void, undefined> {
  let childrenToken = getChildrenToken(parent);
  let index = 0;
  let node = getFilteredSibling(parent.firstChild, filter, true);

  while (node !== null) {
    yield node as T;

    ++index;

    if (parent['_childrenCache'] === childrenToken) {
      node = getFilteredSibling(node.nextSibling, filter, true);
      continue;
    }

    // Children changed, so the node may be detached or moved, and the next node is looked up by its index
    childrenToken = getChildrenToken(parent);
    node = getFilteredSibling(parent.firstChild, filter, true);

    for (let i = 0; i < index && node !== null; ++i) {
      node = getFilteredSibling(node.nextSibling, filter, true);
    }
  }
}

let lastChildrenToken = 0;

/**
 * Returns a value that stays the same until children of the parent change: the children cache of the parent, or if
 * there's no cache, a unique number, so iterating doesn't attach a cache to every visited parent.
 */
function getChildrenToken(parent: Node): ChildrenCache | number {
  const childrenCache = parent['_childrenCache'];

  if (childrenCache !== null) {
    return childrenCache;
  }

  // Masked to stay a small integer, which V8 stores without allocating
  lastChildrenToken = (lastChildrenToken + 1) & 0x3fffffff;

  return (parent['_childrenCache'] = lastChildrenToken);
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
