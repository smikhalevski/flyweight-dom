import { Node } from './Node.js';
import { Element } from './Element.js';
import {
  AbstractConstructor,
  Constructor,
  getNextSiblingOrSelf,
  getPreviousSiblingOrSelf,
  isElement,
} from './utils.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { assertInsertable, assertInsertableNode, uncheckedToInsertableNode } from './uncheckedToInsertableNode.js';
import { ChildNode } from './ChildNode.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';

/**
 * The node that can be a parent of another node.
 *
 * @see [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node) on MDN
 * @group Nodes
 */
export interface ParentNode extends Node {
  /**
   * @see [Element.children](https://developer.mozilla.org/en-US/docs/Web/API/Element/children) on MDN
   */
  readonly children: readonly Node[];

  /**
   * @see [Element.childElementCount](https://developer.mozilla.org/en-US/docs/Web/API/Element/childElementCount) on MDN
   */
  readonly childElementCount: number;

  /**
   * @see [Element.firstElementChild](https://developer.mozilla.org/en-US/docs/Web/API/Element/firstElementChild) on MDN
   */
  readonly firstElementChild: Element | null;

  /**
   * @see [Element.lastElementChild](https://developer.mozilla.org/en-US/docs/Web/API/Element/lastElementChild) on MDN
   */
  readonly lastElementChild: Element | null;

  /**
   * @see [Element.append](https://developer.mozilla.org/en-US/docs/Web/API/Element/append) on MDN
   */
  append(...nodes: Array<Node | string>): this;

  /**
   * @see [Element.prepend](https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend) on MDN
   */
  prepend(...nodes: Array<Node | string>): this;

  /**
   * @see [Element.replaceChildren](https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren) on MDN
   */
  replaceChildren(...nodes: Array<Node | string>): this;

  cloneNode(deep?: boolean): ParentNode;
}

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ParentNode}.
 *
 * @group Nodes
 */
export const ParentNode = {
  /**
   * Extends the constructor prototype with properties and methods of the {@link ParentNode}.
   */
  extend: extendParentNode,
};

export function extendParentNode(constructor: Constructor<ParentNode> | AbstractConstructor<ParentNode>): void {
  const prototype = constructor.prototype;

  Object.defineProperties(prototype, {
    children: {
      get(this: ParentNode) {
        const nodes: Element[] = [];

        this['_children'] = nodes;

        for (let child = this.firstChild; child !== null; child = child.nextSibling) {
          if (isElement(child)) {
            nodes.push(child);
          }
        }
        Object.defineProperty(this, 'children', { value: nodes });

        return nodes;
      },
    },

    childElementCount: {
      get(this: ParentNode) {
        const children = this['_children'];

        if (children) {
          return children.length;
        }

        let count = 0;

        for (let child = this.firstChild; child !== null; child = child.nextSibling) {
          if (isElement(child)) {
            ++count;
          }
        }
        return count;
      },
    },

    firstElementChild: {
      get(this: ParentNode) {
        return getNextSiblingOrSelf(this.firstChild, Node.ELEMENT_NODE);
      },
    },

    lastElementChild: {
      get(this: ParentNode) {
        return getPreviousSiblingOrSelf(this.lastChild, Node.ELEMENT_NODE);
      },
    },
  });

  prototype.appendChild = appendChild;
  prototype.insertBefore = insertBefore;
  prototype.removeChild = removeChild;
  prototype.replaceChild = replaceChild;
  prototype.append = append;
  prototype.prepend = prepend;
  prototype.replaceChildren = replaceChildren;
}

function appendChild<T extends Node>(this: ParentNode, node: T): T {
  assertInsertableNode(this, node);
  uncheckedRemoveAndAppendChild(this, node);
  return node;
}

function insertBefore<T extends Node>(this: ParentNode, node: T, child: Node | null | undefined): T {
  assertInsertableNode(this, node);

  if (child !== null && child !== undefined) {
    if (child.parentNode !== this) {
      throw new Error('The node before which the new node is to be inserted is not a child of this node');
    }
  } else {
    child = this.firstChild;
  }
  if (child !== null) {
    uncheckedRemoveAndInsertBefore(this, node, child as ChildNode);
  } else {
    uncheckedRemoveAndAppendChild(this, node);
  }
  return node;
}

function removeChild<T extends Node>(this: Node, child: T): T {
  if (child.parentNode !== this) {
    throw new Error('The node to be removed is not a child of this node');
  }
  uncheckedRemoveChild(child.parentNode, child as Node as ChildNode);
  return child;
}

function replaceChild<T extends Node>(this: ParentNode, node: Node, child: T): T {
  assertInsertableNode(this, node);

  if (child.parentNode !== this) {
    throw new Error('The node to be replaced is not a child of this node');
  }
  uncheckedRemoveAndInsertBefore(this, node, child as Node as ChildNode);
  uncheckedRemoveChild(this, child as Node as ChildNode);
  return child;
}

function append(this: ParentNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(this, arguments[i]);
  }
  for (let i = 0; i < argumentsLength; ++i) {
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
  }
  return this;
}

function prepend(this: ParentNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  const { firstChild } = this;

  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(this, arguments[i]);
  }
  if (firstChild !== null) {
    for (let i = 0; i < argumentsLength; ++i) {
      uncheckedRemoveAndInsertBefore(this, uncheckedToInsertableNode(arguments[i]), firstChild);
    }
  } else {
    for (let i = 0; i < argumentsLength; ++i) {
      uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
    }
  }
  return this;
}

function replaceChildren(this: ParentNode /*...nodes: Array<Node | string>*/) {
  const argumentsLength = arguments.length;

  const childNodes = this['_childNodes'];
  const children = this['_children'];

  for (let i = 0; i < argumentsLength; ++i) {
    assertInsertable(this, arguments[i]);
  }

  for (let child = this.firstChild; child !== null; child = child.nextSibling) {
    child.parentNode = child.previousSibling = child.nextSibling = null;
  }
  if (childNodes !== undefined) {
    childNodes.length = 0;
  }
  if (children !== undefined) {
    children.length = 0;
  }

  this.firstChild = this.lastChild = null;

  for (let i = 0; i < argumentsLength; ++i) {
    uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
  }
  return this;
}
