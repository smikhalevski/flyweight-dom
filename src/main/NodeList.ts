import type { Node } from './Node.js';
import type { ChildNode } from './ChildNode.js';

/**
 * @see [NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList) on MDN
 * @group Other
 */
export class NodeList<T extends ChildNode = ChildNode> {
  [index: number]: T;

  private _root;
  private _filter;

  constructor(root: Node, filter?: (node: Node) => node is T) {
    this._root = root;
    this._filter = filter;

    return new Proxy<NodeList<T>>(this, proxyHandler);
  }

  /**
   * @see [NodeList.length](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/length) on MDN
   */
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

  /**
   * @see [NodeList.item](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/item) on MDN
   */
  item(index: number): T | null {
    const { _filter } = this;

    for (let child = this._root.firstChild, i = 0; child !== null; child = child.nextSibling) {
      if ((_filter === undefined || _filter(child)) && i++ === index) {
        return child as T;
      }
    }
    return null;
  }

  /**
   * @see [NodeList.values](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/values) on MDN
   */
  *values(): IterableIterator<T> {
    const { _filter } = this;

    for (let child = this._root.firstChild; child !== null; child = child.nextSibling) {
      if (_filter === undefined || _filter(child)) {
        yield child as T;
      }
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values();
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

const proxyHandler: ProxyHandler<NodeList> = {
  get(target, key, _receiver) {
    let index;

    if (typeof key !== 'string' || (index = parseArrayIndex(key)) === -1) {
      return target[key as keyof typeof target];
    } else {
      return target.item(index);
    }
  },
};
