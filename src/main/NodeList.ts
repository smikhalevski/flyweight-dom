import type { ChildNode } from './ChildNode.ts';
import type { Node } from './Node.ts';

/**
 * The callback that returns `true` for children that a list contains.
 */
type ChildFilter = (node: Node) => boolean;

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

  values(): IterableIterator<T> {
    // An array iterator is faster to create and iterate than a generator
    return noNodes.values();
  }
}

const noNodes: never[] = [];

/**
 * The live {@link NodeList} of children of a node. Index access goes through a Proxy, since the list doesn't store
 * nodes, and reads them from the parent on each access.
 *
 * The length and the last accessed node are cached on the parent, so reading nodes one after another takes constant
 * time per access until children of the parent change.
 *
 * **Note:** Iteration reads children by index, the same as in browsers. If children change during iteration, it
 * continues from the next index, see {@link ParentNode} for details.
 *
 * @group Other
 */
export class ChildNodeList<T extends ChildNode = ChildNode> extends NodeList<T> {
  private _parent;
  private _filter;

  /**
   * The list itself. Methods called on the list get its Proxy as `this`, so they read fields from the list directly
   * rather than through the Proxy, which is slower.
   */
  private _target: ChildNodeList<T>;

  /**
   * Creates a new instance of {@link ChildNodeList}.
   *
   * @param parent The node whose children the list contains.
   * @param filter The callback that returns `true` for children that the list contains, or `undefined` if the list
   * contains all children.
   */
  constructor(parent: Node, filter?: (node: Node) => node is T) {
    super();
    this._parent = parent;
    this._filter = filter;
    this._target = this;

    return new Proxy<ChildNodeList<T>>(this, proxyHandler);
  }

  get length(): number {
    const target = this._target;
    const filter = target._filter;
    const cache = getChildrenCache(target._parent, filter);

    if (cache.length !== -1) {
      return cache.length;
    }

    let length = 0;

    for (let child = target._parent.firstChild; child !== null; child = child.nextSibling) {
      if (filter === undefined || filter(child)) {
        ++length;
      }
    }

    cache.length = length;

    return length;
  }

  item(index: number): T | null {
    const target = this._target;
    const filter = target._filter;
    const cache = getChildrenCache(target._parent, filter);

    if (!Number.isInteger(index) || index < 0 || (cache.length !== -1 && index >= cache.length)) {
      return null;
    }

    // Walking from the first child takes as many steps as the index
    const isCachedNodeCloser = cache.index !== -1 && Math.abs(cache.index - index) <= index;

    const node = isCachedNodeCloser
      ? getSiblingAt(cache.node, cache.index, index, filter)
      : getChildAt(target._parent, index, filter);

    if (node !== null) {
      cache.index = index;
      cache.node = node;
    }
    return node as T | null;
  }

  values(): IterableIterator<T> {
    const target = this._target;

    return new ChildNodeIterator(target._parent, target._filter);
  }
}

// The same as in browsers, and for...of doesn't call values() through the Proxy
ChildNodeList.prototype[Symbol.iterator] = ChildNodeList.prototype.values;

/**
 * The cached length and the last accessed node of a {@link ChildNodeList}. Stored on the parent rather than on the
 * list, so the parent drops it when its children change, and the cached node isn't kept in memory after it is removed.
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
   * The cache of a list of filtered children. Stored on the cache of the list of all children, so the parent drops
   * both at once.
   */
  filteredCache: ChildrenCache | null = null;

  /**
   * Creates a new instance of {@link ChildrenCache}.
   *
   * @param version The version of children that the cache is for.
   * @param filter The filter of the list that uses the cache, or `undefined` for the list of all children.
   */
  constructor(
    readonly version: number,
    readonly filter: ChildFilter | undefined
  ) {}
}

/**
 * Returns the cache of a list of children of the parent that pass the filter, and creates it if there's none.
 */
function getChildrenCache(parent: Node, filter: ChildFilter | undefined): ChildrenCache {
  let cache = parent['_childrenCache'];

  // Not an object if children changed, if only iterators read them since then, or if the parent is a leaf node
  if (typeof cache !== 'object' || cache === null) {
    // Keeps the version of children, so iterators don't take the new cache for a change
    cache = parent['_childrenCache'] = new ChildrenCache(getChildrenVersion(parent), undefined);
  }

  if (filter === undefined) {
    return cache;
  }

  let filteredCache = cache.filteredCache;

  // Lists with different filters take over the filtered cache from each other, so it doesn't grow with each filter
  if (filteredCache === null || filteredCache.filter !== filter) {
    filteredCache = cache.filteredCache = new ChildrenCache(cache.version, filter);
  }
  return filteredCache;
}

/**
 * The version that {@link nextChildrenVersion} returned last.
 */
let lastChildrenVersion = 0;

/**
 * Returns a version that no parent had before.
 */
function nextChildrenVersion(): number {
  // Masked to stay a small integer, which V8 stores without allocating
  return (lastChildrenVersion = (lastChildrenVersion + 1) & 0x3fffffff);
}

/**
 * Returns the version of children of the parent, which changes each time children change. The version is assigned on
 * read rather than on change, so changing children costs a single store.
 */
function getChildrenVersion(parent: Node): number {
  const childrenCache = parent['_childrenCache'];

  if (typeof childrenCache === 'number') {
    return childrenCache;
  }
  if (typeof childrenCache === 'object' && childrenCache !== null) {
    return childrenCache.version;
  }
  // Children changed, or the parent is a leaf node
  return (parent['_childrenCache'] = nextChildrenVersion());
}

/**
 * Iterates over children of a parent that pass the filter.
 *
 * Children are returned by index, the same as live lists in browsers, so if children change during iteration, the next
 * node is the one at the next index, and not a sibling of a node that may have been moved to another parent.
 * Doesn't create a {@link ChildNodeList}, so iterating doesn't attach one to every visited parent.
 *
 * A class rather than a generator, since V8 inlines {@link next} into `for…of` loops, which makes iterating about
 * twice as fast.
 */
export class ChildNodeIterator<T extends ChildNode = ChildNode> implements IterableIterator<T> {
  private _parent;
  private _filter;

  /**
   * The version of children of the parent when {@link _lastNode} was returned.
   */
  private _childrenVersion = -1;

  /**
   * The index of the next node to return, which is the number of returned nodes.
   */
  private _nextIndex = 0;

  /**
   * The last returned node, or `null` if no node was returned yet.
   */
  private _lastNode: ChildNode | null = null;

  /**
   * `true` if all nodes were returned.
   */
  private _isDone = false;

  /**
   * Creates a new instance of {@link ChildNodeIterator}.
   *
   * @param parent The node whose children are returned.
   * @param filter The callback that returns `true` for children that are returned, or `undefined` to return all
   * children.
   */
  constructor(parent: Node, filter: ChildFilter | undefined) {
    this._parent = parent;
    this._filter = filter;
  }

  next(): IteratorResult<T, undefined> {
    if (this._isDone) {
      return { value: undefined, done: true };
    }

    const parent = this._parent;
    const filter = this._filter;
    const lastNode = this._lastNode;
    const childrenVersion = getChildrenVersion(parent);

    let node;

    if (lastNode !== null && childrenVersion === this._childrenVersion) {
      node = getNextFilteredSiblingOrSelf(lastNode.nextSibling, filter);
    } else {
      // The first node, or children changed and the last node may have been moved, so the node is found by its index
      this._childrenVersion = childrenVersion;
      node = getChildAt(parent, this._nextIndex, filter);
    }

    if (node === null) {
      this._isDone = true;
      // Releases the node, so a finished iterator doesn't keep it in memory
      this._lastNode = null;
      return { value: undefined, done: true };
    }

    this._lastNode = node;
    ++this._nextIndex;

    return { value: node as T, done: false };
  }

  [Symbol.iterator](): this {
    return this;
  }
}

/**
 * The prototype of built-in iterators, which adds helpers like map() and toArray() in newer runtimes.
 */
const iteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

Object.setPrototypeOf(ChildNodeIterator.prototype, iteratorPrototype);

/**
 * Returns the child at the index, counting only children that pass the filter, or `null` if there's no such child.
 */
function getChildAt(parent: Node, index: number, filter: ChildFilter | undefined): ChildNode | null {
  return getSiblingAt(getNextFilteredSiblingOrSelf(parent.firstChild, filter), 0, index, filter);
}

/**
 * Walks siblings from the node at the given index to the node at the target index, counting only nodes that pass the
 * filter. Returns `null` if there's no node at the target index.
 */
function getSiblingAt(
  node: ChildNode | null,
  nodeIndex: number,
  targetIndex: number,
  filter: ChildFilter | undefined
): ChildNode | null {
  while (node !== null && nodeIndex < targetIndex) {
    node = getNextFilteredSiblingOrSelf(node.nextSibling, filter);
    ++nodeIndex;
  }

  while (node !== null && nodeIndex > targetIndex) {
    node = getPreviousFilteredSiblingOrSelf(node.previousSibling, filter);
    --nodeIndex;
  }

  return node;
}

/**
 * Returns the node or its first following sibling that passes the filter.
 */
function getNextFilteredSiblingOrSelf(node: ChildNode | null, filter: ChildFilter | undefined): ChildNode | null {
  while (node !== null && filter !== undefined && !filter(node)) {
    node = node.nextSibling;
  }
  return node;
}

/**
 * Returns the node or its first preceding sibling that passes the filter.
 */
function getPreviousFilteredSiblingOrSelf(node: ChildNode | null, filter: ChildFilter | undefined): ChildNode | null {
  while (node !== null && filter !== undefined && !filter(node)) {
    node = node.previousSibling;
  }
  return node;
}

/**
 * Returns the array index that the key represents, or -1 if the key isn't an array index.
 */
function parseArrayIndex(key: string | symbol): number {
  if (typeof key !== 'string' || key.length === 0) {
    return -1;
  }

  let charCode = key.charCodeAt(0);

  // An index has no leading zeros
  if (charCode === /* 0 */ 48) {
    return key.length === 1 ? 0 : -1;
  }

  let index = 0;

  for (let i = 0; i < key.length; ++i) {
    charCode = key.charCodeAt(i);

    if (charCode < /* 0 */ 48 || charCode > /* 9 */ 57) {
      return -1;
    }

    index = index * 10 + charCode - /* 0 */ 48;
  }

  return index;
}

const proxyHandler: ProxyHandler<ChildNodeList> = {
  get(target, key) {
    // Fast paths for the most read keys: methods read _target on each call, and loops read length on each step. A read
    // by a constant key is faster than by the variable key below.
    if (key === '_target') {
      return target['_target'];
    }
    if (key === 'length') {
      return target.length;
    }

    const index = parseArrayIndex(key);

    if (index !== -1) {
      // Unlike item(), an index out of range returns undefined, the same as in browsers
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
