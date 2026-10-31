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
 * @group Other
 */
export class LiveNodeList<T extends ChildNode = ChildNode> extends NodeList<T> {
  private _root;
  private _filter;

  /**
   * Creates a new instance of {@link LiveNodeList}.
   *
   * @param root The node whose children the list contains.
   * @param filter The callback that returns `true` for children that the list contains, or `undefined` if the list
   * contains all children.
   */
  constructor(root: Node, filter?: (node: Node) => node is T) {
    super();
    this._root = root;
    this._filter = filter;

    return new Proxy<LiveNodeList<T>>(this, proxyHandler);
  }

  get length(): number {
    const { _filter } = this;

    let length = 0;

    for (let child = this._root.firstChild; child !== null; child = child.nextSibling) {
      if (_filter === undefined || _filter(child)) {
        ++length;
      }
    }

    return length;
  }

  item(index: number): T | null {
    const { _filter } = this;

    for (let child = this._root.firstChild, i = 0; child !== null; child = child.nextSibling) {
      if ((_filter === undefined || _filter(child)) && i++ === index) {
        return child as T;
      }
    }
    return null;
  }

  *values(): IterableIterator<T> {
    const { _filter } = this;

    for (let child = this._root.firstChild; child !== null; child = child.nextSibling) {
      if (_filter === undefined || _filter(child)) {
        yield child as T;
      }
    }
  }
}

function parseArrayIndex(str: string): number {
  if (str.length === 0) {
    return -1;
  }

  let charCode = str.charCodeAt(0);

  if (charCode === /* 0 */ 48) {
    return str.length === 1 ? 0 : -1;
  }

  let index = 0;

  for (let i = 0; i < str.length; ++i) {
    charCode = str.charCodeAt(i);

    if (charCode < /* 0 */ 48 || charCode > /* 9 */ 57) {
      return -1;
    }

    index = index * 10 + charCode - 48;
  }

  return index;
}

const proxyHandler: ProxyHandler<LiveNodeList> = {
  get(target, key, _receiver) {
    let index;

    if (typeof key !== 'string' || (index = parseArrayIndex(key)) === -1) {
      return target[key as keyof typeof target];
    }

    // Unlike item(), an out-of-range index returns undefined, the same as in browsers
    return target.item(index) ?? undefined;
  },
};
