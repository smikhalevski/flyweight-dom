import { Node } from './Node';
import { NodeFilterConstants } from './utils';
import { NodeFilter } from './NodeFilter';

export class TreeWalker {
  currentNode;

  // public readonly
  filter;
  root;
  whatToShow;

  constructor(root: Node, whatToShow?: number, filter: NodeFilter | null = null) {
    this.currentNode = this.root = root;
    this.whatToShow = whatToShow !== undefined ? whatToShow | 0 : NodeFilterConstants.SHOW_ALL;
    this.filter = filter;
  }

  parentNode(): Node | null {
    const { root } = this;

    let node: Node | null = this.currentNode;

    while (node !== null && node !== root) {
      node = node.parentNode;

      if (node !== null && acceptNode(this, node) !== NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
    }
    return null;
  }

  firstChild(): Node | null {
    const { currentNode, root } = this;

    let node: Node | null = currentNode.firstChild;
    let candidate;

    while (node !== null) {
      let result = acceptNode(this, node);

      if (result === NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
      if (result === NodeFilterConstants.FILTER_SKIP && (candidate = node.firstChild) !== null) {
        node = candidate;
        continue;
      }

      while (node !== null) {
        if ((candidate = node.nextSibling) !== null) {
          node = candidate;
          break;
        }
        if ((candidate = node.parentNode) !== null && candidate !== root && candidate !== currentNode) {
          node = candidate;
          continue;
        }
        return null;
      }
    }
    return null;
  }

  lastChild(): Node | null {
    const { currentNode, root } = this;

    let node: Node | null = currentNode.lastChild;
    let candidate;

    while (node !== null) {
      let result = acceptNode(this, node);

      if (result === NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
      if (result === NodeFilterConstants.FILTER_SKIP && (candidate = node.lastChild) !== null) {
        node = candidate;
        continue;
      }

      while (node !== null) {
        if ((candidate = node.previousSibling) !== null) {
          node = candidate;
          break;
        }
        if ((candidate = node.parentNode) !== null && candidate !== root && candidate !== currentNode) {
          node = candidate;
          continue;
        }
        return null;
      }
    }
    return null;
  }

  nextSibling(): Node | null {
    const { root } = this;

    let node = this.currentNode;
    let result;
    let candidate;

    if (node === root) {
      return null;
    }

    while (true) {
      candidate = node.nextSibling;

      while (candidate !== null) {
        node = candidate;
        result = acceptNode(this, node);

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
        if (result === NodeFilterConstants.FILTER_REJECT || (candidate = node.firstChild) === null) {
          candidate = node.nextSibling;
        }
      }

      candidate = node.parentNode;

      if (
        candidate === null ||
        candidate === root ||
        acceptNode(this, candidate) === NodeFilterConstants.FILTER_ACCEPT
      ) {
        return null;
      }

      node = candidate;
    }
  }

  previousSibling(): Node | null {
    const { root } = this;

    let node = this.currentNode;
    let result;
    let candidate;

    if (node === root) {
      return null;
    }

    while (true) {
      candidate = node.previousSibling;

      while (candidate !== null) {
        node = candidate;
        result = acceptNode(this, node);

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
        if (result === NodeFilterConstants.FILTER_REJECT || (candidate = node.lastChild) === null) {
          candidate = node.previousSibling;
        }
      }

      candidate = node.parentNode;

      if (
        candidate === null ||
        candidate === root ||
        acceptNode(this, candidate) === NodeFilterConstants.FILTER_ACCEPT
      ) {
        return null;
      }

      node = candidate;
    }
  }

  nextNode(): Node | null {
    const { root } = this;

    let node = this.currentNode;
    let result = 0;
    let candidate;

    while (true) {
      while (result !== NodeFilterConstants.FILTER_REJECT && (candidate = node.firstChild) !== null) {
        node = candidate;
        result = acceptNode(this, candidate);

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          this.currentNode = candidate;
          return candidate;
        }
      }

      for (let parent: Node | null = node; parent !== null; parent = parent.parentNode) {
        if (parent !== root) {
          return null;
        }
        candidate = parent.nextSibling;

        if (candidate !== null) {
          node = candidate;
          break;
        }
      }

      result = acceptNode(this, node);

      if (result === NodeFilterConstants.FILTER_ACCEPT) {
        this.currentNode = node;
        return node;
      }
    }
  }

  previousNode(): Node | null {
    const { root } = this;

    let node = this.currentNode;
    let result = 0;

    while (node !== root) {
      let sibling = node.previousSibling;

      while (sibling !== null) {
        node = sibling;
        let result = acceptNode(this, sibling);

        while (result !== NodeFilterConstants.FILTER_REJECT && node.lastChild !== null) {
          node = node.lastChild;
          result = acceptNode(this, node);
        }

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          this.currentNode = node;
          return node;
        }

        sibling = node.previousSibling;
      }

      if (node === root || node.parentNode === null) {
        return null;
      }

      node = node.parentNode;

      if (result === NodeFilterConstants.FILTER_ACCEPT) {
        this.currentNode = node;
        return node;
      }
    }
    return null;
  }
}

export function acceptNode(treeWalker: TreeWalker, node: Node): number {
  const { filter } = treeWalker;

  let result;

  if ((((1 << node.nodeType) >> 1) & treeWalker.whatToShow) === 0) {
    return NodeFilterConstants.FILTER_SKIP;
  }
  if (filter !== null) {
    result = typeof filter === 'function' ? filter(node) : filter.acceptNode(node);

    if (result === NodeFilterConstants.FILTER_SKIP || result === NodeFilterConstants.FILTER_REJECT) {
      return result;
    }
  }
  return NodeFilterConstants.FILTER_ACCEPT;
}
