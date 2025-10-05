import { Node } from './Node.js';
import { Element } from './Element.js';
import { getNextSiblingOrSelf, getPreviousSiblingOrSelf, isElement } from './utils.js';
import { uncheckedRemoveAndAppendChild } from './uncheckedRemoveAndAppendChild.js';
import { uncheckedRemoveAndInsertBefore } from './uncheckedRemoveAndInsertBefore.js';
import { assertInsertable, assertInsertableNode, uncheckedToInsertableNode } from './uncheckedToInsertableNode.js';
import { ChildNode } from './ChildNode.js';
import { uncheckedRemoveChild } from './uncheckedRemoveChild.js';
import { NodeList } from './NodeList.js';

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
  readonly children: NodeList<Element>;

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

const parentConstructorCache = new WeakMap();

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ParentNode}.
 *
 * @group Nodes
 */
export function ParentNode(): new () => ParentNode;

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@link ParentNode}.
 *
 * @template T The base node constructor.
 * @group Nodes
 */
export function ParentNode<T extends Node>(constructor: new () => T): new () => T & ParentNode;

export function ParentNode(constructor: new () => Node = Node) {
  let parentConstructor = parentConstructorCache.get(constructor);

  if (parentConstructor !== undefined) {
    return parentConstructor;
  }

  parentConstructor = class extends constructor implements ParentNode {
    declare readonly nodeType: number;

    declare readonly nodeName: string;

    get children(): NodeList<Element> {
      const nodeList = new NodeList(this, isElement);

      Object.defineProperty(this, 'children', { value: nodeList });

      return nodeList;
    }

    get childElementCount(): number {
      let count = 0;

      for (let child = this.firstChild; child !== null; child = child.nextSibling) {
        if (isElement(child)) {
          ++count;
        }
      }
      return count;
    }

    get firstElementChild(): Element | null {
      return getNextSiblingOrSelf(this.firstChild, Node.ELEMENT_NODE) as Element | null;
    }

    get lastElementChild(): Element | null {
      return getPreviousSiblingOrSelf(this.lastChild, Node.ELEMENT_NODE) as Element | null;
    }

    appendChild<T extends Node>(node: T): T {
      assertInsertableNode(this, node);
      uncheckedRemoveAndAppendChild(this, node);
      return node;
    }

    insertBefore<T extends Node>(node: T, child: Node | null | undefined): T {
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

    removeChild<T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        throw new Error('The node to be removed is not a child of this node');
      }
      uncheckedRemoveChild(child.parentNode, child as Node as ChildNode);
      return child;
    }

    replaceChild<T extends Node>(node: Node, child: T): T {
      assertInsertableNode(this, node);

      if (child.parentNode !== this) {
        throw new Error('The node to be replaced is not a child of this node');
      }
      uncheckedRemoveAndInsertBefore(this, node, child as Node as ChildNode);
      uncheckedRemoveChild(this, child as Node as ChildNode);
      return child;
    }

    append(/*...nodes: Array<Node | string>*/) {
      const argumentsLength = arguments.length;

      for (let i = 0; i < argumentsLength; ++i) {
        assertInsertable(this, arguments[i]);
      }
      for (let i = 0; i < argumentsLength; ++i) {
        uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
      }
      return this;
    }

    prepend(/*...nodes: Array<Node | string>*/) {
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

    replaceChildren(/*...nodes: Array<Node | string>*/) {
      const argumentsLength = arguments.length;

      for (let i = 0; i < argumentsLength; ++i) {
        assertInsertable(this, arguments[i]);
      }

      for (let child = this.firstChild; child !== null; child = child.nextSibling) {
        child.parentNode = child.previousSibling = child.nextSibling = null;
      }

      this.firstChild = this.lastChild = null;

      for (let i = 0; i < argumentsLength; ++i) {
        uncheckedRemoveAndAppendChild(this, uncheckedToInsertableNode(arguments[i]));
      }
      return this;
    }

    cloneNode(deep?: boolean): ParentNode {
      return super.cloneNode(deep) as ParentNode;
    }
  };

  parentConstructorCache.set(constructor, parentConstructor);

  return parentConstructor;
}
