import { Node } from './Node';
import { NodeFilterConstants } from './utils';
import { NodeFilter } from './NodeFilter';

/**
 * Implemented according to https://dom.spec.whatwg.org/#treewalker
 */
export class TreeWalker {
  currentNode;

  // public readonly
  root;
  whatToShow;
  filter;

  constructor(root: Node, whatToShow?: number, filter: NodeFilter | null = null) {
    this.currentNode = this.root = root;
    this.whatToShow = whatToShow !== undefined ? Math.abs(whatToShow) | 0 : NodeFilterConstants.SHOW_ALL;
    this.filter = filter;
  }

  parentNode(): Node | null {
    const { root } = this;

    let node: Node | null = this.currentNode;

    while (node != null && node !== root) {
      node = node.parentNode;

      if (node != null && filterNode(this, node) === NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
    }
    return null;
  }

  firstChild(): Node | null {
    const { currentNode, root } = this;

    let node: Node | null = currentNode.firstChild;
    let result;
    let candidate;

    while (node != null) {
      result = filterNode(this, node);

      if (result === NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
      if (result === NodeFilterConstants.FILTER_SKIP && (candidate = node.firstChild) != null) {
        node = candidate;
        continue;
      }

      while (node != null) {
        if ((candidate = node.nextSibling) != null) {
          node = candidate;
          break;
        }
        if ((candidate = node.parentNode) != null && candidate !== root && candidate !== currentNode) {
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
    let result;
    let candidate;

    while (node != null) {
      result = filterNode(this, node);

      if (result === NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
      if (result === NodeFilterConstants.FILTER_SKIP && (candidate = node.lastChild) != null) {
        node = candidate;
        continue;
      }

      while (node != null) {
        if ((candidate = node.previousSibling) != null) {
          node = candidate;
          break;
        }
        if ((candidate = node.parentNode) != null && candidate !== root && candidate !== currentNode) {
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

      while (candidate != null) {
        node = candidate;
        result = filterNode(this, node);

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
        if (result === NodeFilterConstants.FILTER_REJECT || (candidate = node.firstChild) == null) {
          candidate = node.nextSibling;
        }
      }

      candidate = node.parentNode;

      if (
        candidate == null ||
        candidate === root ||
        filterNode(this, candidate) === NodeFilterConstants.FILTER_ACCEPT
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

      while (candidate != null) {
        node = candidate;
        result = filterNode(this, node);

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
        if (result === NodeFilterConstants.FILTER_REJECT || (candidate = node.lastChild) == null) {
          candidate = node.previousSibling;
        }
      }

      candidate = node.parentNode;

      if (
        candidate == null ||
        candidate === root ||
        filterNode(this, candidate) === NodeFilterConstants.FILTER_ACCEPT
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
      while (result !== NodeFilterConstants.FILTER_REJECT && (candidate = node.firstChild) != null) {
        node = candidate;
        result = filterNode(this, candidate);

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          return (this.currentNode = candidate);
        }
      }

      for (let parent: Node | null = node; parent != null; parent = parent.parentNode) {
        if (parent === root) {
          return null;
        }
        if ((candidate = parent.nextSibling) != null) {
          node = candidate;
          break;
        }
      }

      result = filterNode(this, node);

      if (result === NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
    }
  }

  previousNode(): Node | null {
    const { root } = this;

    let node = this.currentNode;
    let result;
    let candidate;

    while (node !== root) {
      for (candidate = node.previousSibling; candidate != null; candidate = node.previousSibling) {
        do {
          node = candidate;
          result = filterNode(this, candidate);
        } while (result !== NodeFilterConstants.FILTER_REJECT && (candidate = node.lastChild) != null);

        if (result === NodeFilterConstants.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
      }

      if (node === root || (candidate = node.parentNode) == null) {
        break;
      }
      if (filterNode(this, candidate) === NodeFilterConstants.FILTER_ACCEPT) {
        return (this.currentNode = candidate);
      }
      node = candidate;
    }
    return null;
  }
}

export function filterNode(treeWalker: TreeWalker, node: Node): number {
  const { filter } = treeWalker;

  let result;

  if ((((1 << node.nodeType) >> 1) & treeWalker.whatToShow) === 0) {
    return NodeFilterConstants.FILTER_SKIP;
  }
  if (filter != null) {
    result = typeof filter === 'function' ? filter(node) : filter.acceptNode(node);

    if (result === NodeFilterConstants.FILTER_SKIP || result === NodeFilterConstants.FILTER_REJECT) {
      return result;
    }
  }
  return NodeFilterConstants.FILTER_ACCEPT;
}
