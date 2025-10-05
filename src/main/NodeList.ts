import { Node } from './Node.js';

export class NodeList<T extends Node = Node> {
  [index: number]: Node;

  private _parentNode;
  private _filter;

  constructor(parentNode: Node, filter?: (node: Node) => node is T) {
    this._parentNode = parentNode;
    this._filter = filter;

    return new Proxy(this, proxyHandler) as NodeList<T>;
  }

  get length(): number {
    const { _filter } = this;

    let length = 0;

    for (let child = this._parentNode.firstChild; child !== null; child = child.nextSibling) {
      if (_filter === undefined || _filter(child)) {
        ++length;
      }
    }

    return length;
  }

  item(index: number): Node | null {
    const { _filter } = this;

    for (let child = this._parentNode.firstChild, i = 0; child !== null; child = child.nextSibling) {
      if ((_filter === undefined || _filter(child)) && i++ === index) {
        return child;
      }
    }
    return null;
  }

  *[Symbol.iterator](): IterableIterator<Node> {
    const { _filter } = this;

    for (let child = this._parentNode.firstChild; child !== null; child = child.nextSibling) {
      if (_filter === undefined || _filter(child)) {
        yield child;
      }
    }
  }
}

function parseIndex(str: string): number {
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

    if (typeof key !== 'string' || (index = parseIndex(key)) === -1) {
      return target[key as keyof typeof target];
    } else {
      return target.item(index);
    }
  },
};
