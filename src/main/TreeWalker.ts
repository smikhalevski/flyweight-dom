import { Node } from './Node.js';
import type { NodeFilter } from './NodeFilter.js';

const FILTER_ACCEPT = 1;
const FILTER_REJECT = 2;
const FILTER_SKIP = 3;
const SHOW_ALL = 0xffffffff;

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
   * Creates a new {@link TreeWalker} instance.
   *
   * @param root A root {@link Node} of this {@link TreeWalker} traversal.
   * @param whatToShow A unsigned long representing a bitmask created by combining the constant properties of
   * {@link NodeFilter}.
   * @param filter A {@link NodeFilter}, that is an object with a method `acceptNode`, which is called by the
   * {@link TreeWalker} to determine whether to accept a node that has passed the `whatToShow` check.
   */
  constructor(
    /**
     * @see [TreeWalker.root](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/root) on MDN
     */
    readonly root: Node,

    /**
     * @see [TreeWalker.whatToShow](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/whatToShow) on MDN
     */
    readonly whatToShow: number = SHOW_ALL,

    /**
     * @see [TreeWalker.filter](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/filter) on MDN
     */
    readonly filter: NodeFilter | null = null
  ) {
    this.currentNode = root;
  }

  /**
   * @see [TreeWalker.parentNode](https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/parentNode) on MDN
   */
  parentNode(): Node | null {
    const { root } = this;

    let node: Node | null = this.currentNode;

    while (node !== null && node !== root) {
      node = node.parentNode;

      if (node !== null && filterNode(this, node) === FILTER_ACCEPT) {
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

      if (result === FILTER_ACCEPT) {
        return (this.currentNode = node);
      }

      if (result === FILTER_SKIP && (candidate = node.firstChild) !== null) {
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

      if (result === FILTER_ACCEPT) {
        return (this.currentNode = node);
      }

      if (result === FILTER_SKIP && (candidate = node.lastChild) !== null) {
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

        if (result === FILTER_ACCEPT) {
          return (this.currentNode = node);
        }

        if (result === FILTER_REJECT || (candidate = node.firstChild) === null) {
          candidate = node.nextSibling;
        }
      }

      candidate = node.parentNode;

      if (candidate === null || candidate === root || filterNode(this, candidate) === FILTER_ACCEPT) {
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

        if (result === FILTER_ACCEPT) {
          return (this.currentNode = node);
        }

        if (result === FILTER_REJECT || (candidate = node.lastChild) === null) {
          candidate = node.previousSibling;
        }
      }

      candidate = node.parentNode;

      if (candidate === null || candidate === root || filterNode(this, candidate) === FILTER_ACCEPT) {
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
      while (result !== FILTER_REJECT && (candidate = node.firstChild) !== null) {
        node = candidate;
        result = filterNode(this, candidate);

        if (result === FILTER_ACCEPT) {
          return (this.currentNode = candidate);
        }
      }

      let parent: Node | null = node;

      while (parent !== null) {
        if (parent === root) {
          return null;
        }

        if ((candidate = parent.nextSibling) !== null) {
          node = candidate;
          break;
        }

        parent = parent.parentNode;
      }

      if (parent === null) {
        // The current node isn't inside the root, for example, it was removed from the tree
        return null;
      }

      result = filterNode(this, node);

      if (result === FILTER_ACCEPT) {
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
        } while (result !== FILTER_REJECT && (candidate = node.lastChild) !== null);

        if (result === FILTER_ACCEPT) {
          return (this.currentNode = node);
        }
      }

      if (node === root || (candidate = node.parentNode) === null) {
        break;
      }

      if (filterNode(this, candidate) === FILTER_ACCEPT) {
        return (this.currentNode = candidate);
      }

      node = candidate;
    }

    return null;
  }
}

export function filterNode(treeWalker: TreeWalker, node: Node): number {
  const { filter } = treeWalker;

  if ((((1 << node.nodeType) >> 1) & treeWalker.whatToShow) === 0) {
    return FILTER_SKIP;
  }

  if (filter === null) {
    return FILTER_ACCEPT;
  }

  const result = typeof filter === 'function' ? filter(node) : filter.acceptNode(node);

  // Same conversion to unsigned short as in browsers: true becomes FILTER_ACCEPT, while false and undefined become 0,
  // which traversal methods don't accept
  return result & 0xffff;
}
