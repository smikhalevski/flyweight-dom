import { Node } from './Node';
import { NodeFilter } from './NodeFilter';

/**
 * Implemented according to https://dom.spec.whatwg.org/#treewalker
 *
 * @see [TreeWalker](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker) on MDN
 * @group Other
 */
export class TreeWalker {
  /**
   * @see [TreeWalker.currentNode](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/currentNode) on MDN
   */
  currentNode: Node;

  /**
   * @see [TreeWalker.root](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/root) on MDN
   */
  readonly root: Node;

  /**
   * @see [TreeWalker.whatToShow](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/whatToShow) on MDN
   */
  readonly whatToShow: number;

  /**
   * @see [TreeWalker.filter](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/filter) on MDN
   */
  readonly filter: NodeFilter | null;

  /**
   * Creates a new {@link TreeWalker} instance.
   *
   * @param root A root {@link Node} of this {@link TreeWalker} traversal.
   * @param whatToShow A unsigned long representing a bitmask created by combining the constant properties of
   * {@link NodeFilter}.
   * @param filter A {@link NodeFilter}, that is an object with a method `acceptNode`, which is called by the
   * {@link TreeWalker} to determine whether to accept a node that has passed the `whatToShow` check.
   */
  constructor(root: Node, whatToShow?: number, filter: NodeFilter | null = null) {
    this.currentNode = this.root = root;
    this.whatToShow = whatToShow !== undefined ? whatToShow : NodeFilter.SHOW_ALL;
    this.filter = filter;
  }

  /**
   * @see [TreeWalker.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/parentNode) on MDN
   */
  parentNode(): Node | null {
    const { root } = this;

    let node: Node | null = this.currentNode;

    while (node !== null && node !== root) {
      node = node.parentNode;

      if (node !== null && filterNode(this, node) === NodeFilter.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
    }
    return null;
  }

  /**
   * @see [TreeWalker.firstChild](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/firstChild) on MDN
   */
  firstChild(): Node | null {
    const { currentNode, root } = this;

    let node: Node | null = currentNode.firstChild;
    let result;
    let candidate;

    while (node !== null) {
      result = filterNode(this, node);

      if (result === NodeFilter.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
      if (result === NodeFilter.FILTER_SKIP && (candidate = node.firstChild) !== null) {
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

  /**
   * @see [TreeWalker.lastChild](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/lastChild) on MDN
   */
  lastChild(): Node | null {
    const { currentNode, root } = this;

    let node: Node | null = currentNode.lastChild;
    let result;
    let candidate;

    while (node !== null) {
      result = filterNode(this, node);

      if (result === NodeFilter.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
      if (result === NodeFilter.FILTER_SKIP && (candidate = node.lastChild) !== null) {
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

  /**
   * @see [TreeWalker.nextSibling](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/nextSibling) on MDN
   */
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
        result = filterNode(this, node);

        if (result === NodeFilter.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
        if (result === NodeFilter.FILTER_REJECT || (candidate = node.firstChild) == null) {
          candidate = node.nextSibling;
        }
      }

      candidate = node.parentNode;

      if (candidate == null || candidate === root || filterNode(this, candidate) === NodeFilter.FILTER_ACCEPT) {
        return null;
      }

      node = candidate;
    }
  }

  /**
   * @see [TreeWalker.previousSibling](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/previousSibling) on MDN
   */
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
        result = filterNode(this, node);

        if (result === NodeFilter.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
        if (result === NodeFilter.FILTER_REJECT || (candidate = node.lastChild) == null) {
          candidate = node.previousSibling;
        }
      }

      candidate = node.parentNode;

      if (candidate == null || candidate === root || filterNode(this, candidate) === NodeFilter.FILTER_ACCEPT) {
        return null;
      }

      node = candidate;
    }
  }

  /**
   * @see [TreeWalker.nextNode](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/nextNode) on MDN
   */
  nextNode(): Node | null {
    const { root } = this;

    let node = this.currentNode;
    let result = 0;
    let candidate;

    while (true) {
      while (result !== NodeFilter.FILTER_REJECT && (candidate = node.firstChild) !== null) {
        node = candidate;
        result = filterNode(this, candidate);

        if (result === NodeFilter.FILTER_ACCEPT) {
          return (this.currentNode = candidate);
        }
      }

      for (let parent: Node | null = node; parent !== null; parent = parent.parentNode) {
        if (parent === root) {
          return null;
        }
        if ((candidate = parent.nextSibling) !== null) {
          node = candidate;
          break;
        }
      }

      result = filterNode(this, node);

      if (result === NodeFilter.FILTER_ACCEPT) {
        return (this.currentNode = node);
      }
    }
  }

  /**
   * @see [TreeWalker.previousNode](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/previousNode) on MDN
   */
  previousNode(): Node | null {
    const { root } = this;

    let node = this.currentNode;
    let result;
    let candidate;

    while (node !== root) {
      for (candidate = node.previousSibling; candidate !== null; candidate = node.previousSibling) {
        do {
          node = candidate;
          result = filterNode(this, candidate);
        } while (result !== NodeFilter.FILTER_REJECT && (candidate = node.lastChild) !== null);

        if (result === NodeFilter.FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
      }

      if (node === root || (candidate = node.parentNode) == null) {
        break;
      }
      if (filterNode(this, candidate) === NodeFilter.FILTER_ACCEPT) {
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
    return NodeFilter.FILTER_SKIP;
  }
  if (filter !== null) {
    result = typeof filter === 'function' ? filter(node) : filter.acceptNode(node);

    if (result === NodeFilter.FILTER_SKIP || result === NodeFilter.FILTER_REJECT) {
      return result;
    }
  }
  return NodeFilter.FILTER_ACCEPT;
}
