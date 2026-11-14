/**
 * The jQuery-style queries that select elements of a tree.
 *
 * ```ts
 * import { $ } from 'flyweight-dom/query';
 *
 * const query = $(document)
 *   .descendants('item')
 *   .children('title')
 *   .hasAttribute('lang', 'en');
 *
 * query.nodes;
 * // ⮕ [Element, Element]
 * ```
 *
 * @module flyweight-dom/query
 */

import { DocumentFragment } from './DocumentFragment.ts';
import { splitTokens } from './DOMTokenList.ts';
import { Element } from './Element.ts';
import { hasClassNames } from './getElementsByClassName.ts';
import { hasTagNameNS } from './getElementsByTagNameNS.ts';
import type { Node } from './Node.ts';
import {
  ELEMENT_NODE,
  getNextSiblingOrSelf,
  getPreviousSiblingOrSelf,
  hasOwnProperty,
  isElement,
  isText,
} from './utils.ts';

/**
 * Creates a query that holds the given node, so its children and descendants can be selected.
 *
 * @param node The node where the query starts.
 * @template TNode The node where the query starts.
 * @group Query
 */
export function $<TNode extends Node>(node: TNode): NodeQuery<TNode> {
  return new NodeQuery([node]);
}

/**
 * The condition that an attribute value or a text must meet: the string that it must be equal to, or the regular
 * expression that it must match, or the callback that returns `true` for a suitable string.
 *
 * @group Query
 */
export type StringPredicate = string | RegExp | ((value: string) => boolean);

/**
 * The list of selected nodes. A query isn't changed after it is created: each method returns a new query, so a query
 * can be reused as the start of other queries.
 *
 * @template TNode The selected node.
 * @group Query
 */
export class NodeQuery<TNode extends Node = Element> implements Iterable<TNode> {
  /**
   * Creates a new instance of {@link NodeQuery}.
   *
   * @param nodes The selected nodes. The array isn't copied and must not contain the same node twice.
   */
  constructor(
    /**
     * The selected nodes.
     */
    readonly nodes: readonly TNode[]
  ) {}

  /**
   * Selects child elements of {@link nodes} that have the given local name and namespace, the same as the `>`
   * combinator in CSS.
   *
   * Elements are returned in the order of their parents in {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  children(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const elements = [];

    for (const node of this.nodes) {
      for (let child = node.firstChild; child !== null; child = child.nextSibling) {
        if (isElement(child) && hasTagNameNS(child, namespaceURI, localName)) {
          elements.push(child);
        }
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects descendant elements of {@link nodes} that have the given local name and namespace, the same as the
   * descendant combinator in CSS.
   *
   * Each element is returned once, even if several of {@link nodes} contain it.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  descendants(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // Nodes that have children, since only they can contain other nodes. A single node can't be nested, so the set
    // isn't needed
    let containerSet: Set<Node> | null = null;

    if (nodes.length > 1) {
      containerSet = new Set();

      for (const node of nodes) {
        if (node.firstChild !== null) {
          containerSet.add(node);
        }
      }
      if (containerSet.size < 2) {
        containerSet = null;
      }
    }

    const elements: Element[] = [];

    for (const node of nodes) {
      // A node that has no children, has no descendants
      if (node.firstChild === null) {
        continue;
      }

      // Descendants of a nested node are found when its ancestor is searched
      if (containerSet === null || !hasAncestor(node, containerSet)) {
        pushDescendants(node, namespaceURI, localName, elements);
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects elements from {@link nodes} that have the attribute, the same as the `[name]` and `[name=value]` selectors
   * in CSS.
   *
   * @param name The qualified name of the attribute.
   * @param predicate The string that the attribute value must be equal to, or the regular expression that it must
   * match, or the callback that returns `true` if the element with the given attribute value must be selected. If
   * omitted, all elements that have the attribute are selected.
   */
  hasAttribute(name: string, predicate?: StringPredicate): NodeQuery {
    const elements = [];

    for (const node of this.nodes) {
      if (!isElement(node)) {
        continue;
      }

      const { attributes } = node;
      const value = attributes[name];

      // The value is read before the own property check that getAttribute makes, since most elements don't have the
      // attribute, and reading a missing property is faster than the check
      if (value !== undefined && hasOwnProperty(attributes, name) && isMatchingValue(value, predicate)) {
        elements.push(node);
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects elements from {@link nodes} that have the attribute with the given namespace and local name, whatever its
   * prefix is.
   *
   * @param namespaceURI The namespace of the attribute, or `null` for an attribute without a namespace.
   * @param localName The local name of the attribute.
   * @param predicate The string that the attribute value must be equal to, or the regular expression that it must
   * match, or the callback that returns `true` if the element with the given attribute value must be selected. If
   * omitted, all elements that have the attribute are selected.
   */
  hasAttributeNS(namespaceURI: string | null, localName: string, predicate?: StringPredicate): NodeQuery {
    const elements = [];

    for (const node of this.nodes) {
      if (!isElement(node)) {
        continue;
      }

      const value = node.getAttributeNS(namespaceURI, localName);

      if (value !== null && isMatchingValue(value, predicate)) {
        elements.push(node);
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects the node at the given index of {@link nodes}, so a query can go on from a single node.
   *
   * @param index The index of the node. A negative index is counted from the last node, the same as in
   * [Array.at](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at).
   */
  at(index: number): NodeQuery<TNode> {
    const { nodes } = this;
    const node = nodes[index < 0 ? nodes.length + index : index];

    return new NodeQuery(node === undefined ? [] : [node]);
  }

  /**
   * Selects the first of {@link nodes}.
   */
  first(): NodeQuery<TNode> {
    return this.at(0);
  }

  /**
   * Selects the last of {@link nodes}.
   */
  last(): NodeQuery<TNode> {
    return this.at(-1);
  }

  /**
   * Selects elements from {@link nodes} that have the class, the same as the `.class` selector in CSS.
   *
   * @param className The class name, or several class names separated by whitespace that an element must all have.
   */
  hasClass(className: string): NodeQuery {
    const classNames = splitTokens(className);
    const elements = [];

    // An element doesn't have a class if no class name is given
    if (classNames.length !== 0) {
      for (const node of this.nodes) {
        if (isElement(node) && hasClassNames(node, classNames)) {
          elements.push(node);
        }
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects elements from {@link nodes} that are at the given index among element children of their parents, the same
   * as the `:nth-child()` selector in CSS.
   *
   * **Note:** Unlike in CSS, the index of the first child is 0, the same as in {@link at}.
   *
   * @param index The index of the element among its sibling elements. A negative index is counted from the last
   * child, so -1 is the same as the `:last-child` selector in CSS.
   */
  nthChild(index: number): NodeQuery {
    const { nodes } = this;
    const isReversed = index < 0;

    // The number of sibling elements that must precede the element, or follow it if the index is negative
    const siblingCount = isReversed ? -index - 1 : index;
    const elements = [];

    if (siblingCount === 0) {
      // The first or the last child has no sibling element on its side, which is the fastest to check
      for (const node of nodes) {
        if (isElement(node) && (isReversed ? node.nextElementSibling : node.previousElementSibling) === null) {
          elements.push(node);
        }
      }

      return new NodeQuery(elements);
    }

    // The count of the last element is reused if a walk from the next element reaches it, so a run of siblings is
    // read once instead of once per sibling. For a negative index, siblings are counted towards the last child, so
    // nodes are read from the last one, since then a walk reaches the element that was counted before
    let lastElement: Element | null = null;
    let lastCount = 0;

    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[isReversed ? nodes.length - i - 1 : i];

      if (!isElement(node)) {
        continue;
      }

      const count = isReversed
        ? getFollowingCount(node, siblingCount, lastElement, lastCount)
        : getPrecedingCount(node, siblingCount, lastElement, lastCount);

      lastElement = node;
      lastCount = count;

      if (count === siblingCount) {
        elements.push(node);
      }
    }

    if (isReversed) {
      elements.reverse();
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects elements from {@link nodes} that are the first element children of their parents, the same as the
   * `:first-child` selector in CSS.
   *
   * **Note:** Unlike `firstChild` of a DOM node, this method doesn't select children of {@link nodes}.
   */
  firstChild(): NodeQuery {
    return this.nthChild(0);
  }

  /**
   * Selects elements from {@link nodes} that are the last element children of their parents, the same as the
   * `:last-child` selector in CSS.
   *
   * **Note:** Unlike `lastChild` of a DOM node, this method doesn't select children of {@link nodes}.
   */
  lastChild(): NodeQuery {
    return this.nthChild(-1);
  }

  /**
   * Selects {@link nodes} that have neither child elements nor text, the same as the `:empty` selector in CSS.
   */
  hasNoContent(): NodeQuery<TNode> {
    const nodes = [];

    for (const node of this.nodes) {
      if (hasNoContent(node)) {
        nodes.push(node);
      }
    }

    return new NodeQuery(nodes);
  }

  /**
   * Selects {@link nodes} and nodes of the other query, the same as the `,` in a CSS selector. Each node is returned
   * once, even if both queries have it.
   *
   * @param query The query to add nodes from.
   * @template TOtherNode The node of the other query.
   */
  union<TOtherNode extends Node>(query: NodeQuery<TOtherNode>): NodeQuery<TNode | TOtherNode> {
    const { nodes } = this;
    const otherNodes = query.nodes;

    // Arrays of nodes are never changed, so an array is shared if the other one has nothing to add
    if (otherNodes.length === 0) {
      return new NodeQuery<TNode | TOtherNode>(nodes);
    }
    if (nodes.length === 0) {
      return new NodeQuery<TNode | TOtherNode>(otherNodes);
    }

    const unionNodes: Array<TNode | TOtherNode> = nodes.slice();

    // A scan of a short array is faster than a lookup in a set, and the set of a long array is slow to create
    const nodeSet = nodes.length > 16 && otherNodes.length > 16 ? new Set<Node>(nodes) : null;

    for (const node of otherNodes) {
      if (nodeSet !== null ? !nodeSet.has(node) : (nodes as readonly Node[]).indexOf(node) === -1) {
        unionNodes.push(node);
      }
    }

    return new NodeQuery(unionNodes);
  }

  /**
   * Selects {@link nodes} by their text content.
   *
   * @param predicate The string that the text content must be equal to, or the regular expression that it must match,
   * or the callback that returns `true` if the node with the given text content must be selected. If omitted, all
   * nodes that have a non-empty text content are selected.
   */
  hasText(predicate?: StringPredicate): NodeQuery<TNode> {
    const nodes = [];

    for (const node of this.nodes) {
      if (isMatchingText(node, predicate)) {
        nodes.push(node);
      }
    }

    return new NodeQuery(nodes);
  }

  /**
   * Selects {@link nodes} that pass the predicate.
   *
   * @param predicate Returns `true` if the node must be selected.
   */
  filter(predicate: (node: TNode, index: number) => boolean): NodeQuery<TNode> {
    return new NodeQuery(this.nodes.filter(predicate));
  }

  /**
   * Selects {@link nodes} that don't pass the predicate, the same as the `:not()` selector in CSS.
   *
   * @param predicate Returns `true` if the node must not be selected.
   */
  not(predicate: (node: TNode, index: number) => boolean): NodeQuery<TNode> {
    const nodes = [];

    for (let i = 0; i < this.nodes.length; ++i) {
      if (!predicate(this.nodes[i], i)) {
        nodes.push(this.nodes[i]);
      }
    }

    return new NodeQuery(nodes);
  }

  /**
   * Selects {@link nodes} that have a descendant element with the given local name and namespace, the same as the
   * `:has()` selector in CSS.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  has(localName = '*', namespaceURI: string | null = '*'): NodeQuery<TNode> {
    const nodes = [];

    for (const node of this.nodes) {
      if (hasDescendant(node, namespaceURI, localName)) {
        nodes.push(node);
      }
    }

    return new NodeQuery(nodes);
  }

  /**
   * Selects parent elements of {@link nodes} that have the given local name and namespace.
   *
   * Each element is returned once, even if it is the parent of several of {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  parent(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // A single node has no other node to share the parent with, so the set isn't needed
    const parentSet = nodes.length > 1 ? new Set<Node>() : null;
    const elements = [];

    let lastParent: Node | null = null;

    for (const node of nodes) {
      const parent = node.parentNode;

      // Siblings usually go in a row, so the parent of the previous node is checked before the set is read
      if (parent === null || parent === lastParent) {
        continue;
      }

      lastParent = parent;

      // The parent is added to the set only if it matches, since the check is faster than the set
      if (
        isElement(parent) &&
        hasTagNameNS(parent, namespaceURI, localName) &&
        (parentSet === null || addUnique(parentSet, parent))
      ) {
        elements.push(parent);
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects ancestor elements of {@link nodes} that have the given local name and namespace. Ancestors of each node
   * are returned from the closest one to the farthest one.
   *
   * Each element is returned once, even if it is an ancestor of several of {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  ancestors(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // Ancestors that were read already, so the walk up from a node stops at an ancestor it shares with previous nodes.
    // A single node has no other node to share ancestors with, so the set isn't needed
    const ancestorSet = nodes.length > 1 ? new Set<Node>() : null;
    const elements = [];

    let lastParent: Node | null = null;

    for (const node of nodes) {
      // Siblings usually go in a row, and ancestors of the previous node were read already
      if (node.parentNode === lastParent) {
        continue;
      }

      lastParent = node.parentNode;

      for (
        let ancestor = node.parentNode;
        ancestor !== null && (ancestorSet === null || addUnique(ancestorSet, ancestor));
        ancestor = ancestor.parentNode
      ) {
        if (isElement(ancestor) && hasTagNameNS(ancestor, namespaceURI, localName)) {
          elements.push(ancestor);
        }
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * For each of {@link nodes}, selects the closest element with the given local name and namespace, which is the node
   * itself or its ancestor.
   *
   * Each element is returned once, even if it is the closest one for several of {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  closest(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // A single node has no other node to share the closest element with, so the set isn't needed
    const elementSet = nodes.length > 1 ? new Set<Element>() : null;
    const elements = [];

    let lastElement: Element | null = null;

    for (const node of nodes) {
      const element = getClosestElement(node, namespaceURI, localName);

      // Nodes that have the same closest element usually go in a row, so the previous one is checked before the set
      // is read
      if (element === null || element === lastElement) {
        continue;
      }

      lastElement = element;

      // A node that has no children isn't an ancestor, so it is the closest element only for itself
      if (
        elementSet === null ||
        (element === (node as Node) && node.firstChild === null) ||
        addUnique(elementSet, element)
      ) {
        elements.push(element);
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects sibling elements of {@link nodes} that have the given local name and namespace. A node isn't its own
   * sibling, so it is selected only if another of {@link nodes} has the same parent.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  siblings(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;
    const elements: Element[] = [];

    if (nodes.length === 1) {
      // A single node has no other node to share the parent with, so the map isn't needed
      const parent = nodes[0].parentNode;

      if (parent !== null) {
        pushSiblings(parent, nodes[0], namespaceURI, localName, elements);
      }

      return new NodeQuery(elements);
    }

    // For each parent, the only child that is among nodes, or null if there are several, so each parent is read once
    const childMap = new Map<Node, Node | null>();

    for (const node of nodes) {
      const parent = node.parentNode;

      if (parent === null) {
        continue;
      }

      const child = childMap.get(parent);

      if (child === undefined) {
        childMap.set(parent, node);
      } else if (child !== null) {
        childMap.set(parent, null);
      }
    }

    for (const [parent, excludedChild] of childMap) {
      pushSiblings(parent, excludedChild, namespaceURI, localName, elements);
    }

    return new NodeQuery(elements);
  }

  /**
   * For each of {@link nodes}, selects the next sibling element if it has the given local name and namespace, the same
   * as the `+` combinator in CSS.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  next(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const elements = [];

    for (const node of this.nodes) {
      const element = getNextSiblingOrSelf(node.nextSibling, ELEMENT_NODE) as Element | null;

      if (element !== null && hasTagNameNS(element, namespaceURI, localName)) {
        elements.push(element);
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * For each of {@link nodes}, selects the previous sibling element if it has the given local name and namespace.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  previous(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const elements = [];

    for (const node of this.nodes) {
      const element = getPreviousSiblingOrSelf(node.previousSibling, ELEMENT_NODE) as Element | null;

      if (element !== null && hasTagNameNS(element, namespaceURI, localName)) {
        elements.push(element);
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects sibling elements that follow {@link nodes} and have the given local name and namespace, the same as the `~`
   * combinator in CSS.
   *
   * Each element is returned once, even if it follows several of {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  following(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // Sibling elements that were read already, so the walk from a node stops at a sibling that follows a previous
    // node. A single node has no other node to share siblings with, so the set isn't needed
    const siblingSet = nodes.length > 1 ? new Set<Node>() : null;
    const elements = [];

    for (const node of nodes) {
      for (let sibling = node.nextSibling; sibling !== null; sibling = sibling.nextSibling) {
        if (!isElement(sibling)) {
          continue;
        }

        // All siblings that follow a sibling that was read, were read too
        if (siblingSet !== null && !addUnique(siblingSet, sibling)) {
          break;
        }

        if (hasTagNameNS(sibling, namespaceURI, localName)) {
          elements.push(sibling);
        }
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Selects sibling elements that precede {@link nodes} and have the given local name and namespace. Siblings of each
   * node are returned from the closest one to the farthest one.
   *
   * Each element is returned once, even if it precedes several of {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  preceding(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // Sibling elements that were read already, so the walk from a node stops at a sibling that precedes a previous
    // node. A single node has no other node to share siblings with, so the set isn't needed
    const siblingSet = nodes.length > 1 ? new Set<Node>() : null;
    const elements = [];

    for (const node of nodes) {
      for (let sibling = node.previousSibling; sibling !== null; sibling = sibling.previousSibling) {
        if (!isElement(sibling)) {
          continue;
        }

        // All siblings that precede a sibling that was read, were read too
        if (siblingSet !== null && !addUnique(siblingSet, sibling)) {
          break;
        }

        if (hasTagNameNS(sibling, namespaceURI, localName)) {
          elements.push(sibling);
        }
      }
    }

    return new NodeQuery(elements);
  }

  /**
   * Returns the attribute value of the first of {@link nodes}, or `null` if it has no such attribute, or isn't an
   * element, or there are no nodes.
   *
   * @param name The qualified name of the attribute.
   */
  getAttribute(name: string): string | null {
    const node = this.nodes[0];

    return node !== undefined && isElement(node) ? node.getAttribute(name) : null;
  }

  /**
   * Returns the value of the attribute with the given namespace and local name of the first of {@link nodes}, or
   * `null` if it has no such attribute, or isn't an element, or there are no nodes.
   *
   * @param namespaceURI The namespace of the attribute, or `null` for an attribute without a namespace.
   * @param localName The local name of the attribute.
   */
  getAttributeNS(namespaceURI: string | null, localName: string): string | null {
    const node = this.nodes[0];

    return node !== undefined && isElement(node) ? node.getAttributeNS(namespaceURI, localName) : null;
  }

  /**
   * Returns the concatenated text content of {@link nodes}.
   */
  text(): string {
    let text = '';

    for (const node of this.nodes) {
      const value = node.textContent;

      if (value !== null) {
        text += value;
      }
    }

    return text;
  }

  /**
   * Removes {@link nodes} from their parents. Removed nodes stay in the query, so they can be inserted elsewhere.
   */
  remove(): this {
    for (const node of this.nodes) {
      if (node.parentNode !== null) {
        node.parentNode.removeChild(node);
      }
    }

    return this;
  }

  [Symbol.iterator](): IterableIterator<TNode> {
    return this.nodes[Symbol.iterator]();
  }
}

/**
 * Returns `true` if the string meets the predicate.
 */
function isMatchingValue(value: string, predicate: StringPredicate | undefined): boolean {
  if (predicate === undefined) {
    return true;
  }
  if (typeof predicate === 'string') {
    return value === predicate;
  }
  if (typeof predicate === 'function') {
    return predicate(value);
  }

  // Unlike RegExp.test, the search doesn't depend on lastIndex of a global expression, and doesn't change it
  return value.search(predicate) !== -1;
}

/**
 * Returns `true` if the node has neither child elements nor text with data. Comments and processing instructions
 * don't count, the same as for the `:empty` selector in CSS.
 */
function hasNoContent(node: Node): boolean {
  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (isElement(child) || (isText(child) && child.data.length !== 0)) {
      return false;
    }
  }
  return true;
}

/**
 * Returns `true` if the text content of the node meets the predicate.
 */
function isMatchingText(node: Node, predicate: StringPredicate | undefined): boolean {
  // The text content of an element is the text of its descendants, and it is slow to concatenate. So descendants are
  // read first to tell whether there's any text, or whether the text can be equal to the string. Subclasses may have
  // their own text content, so their getter is always called
  if (node.constructor === Element || node.constructor === DocumentFragment) {
    if (predicate === undefined) {
      return hasTextData(node);
    }
    if (typeof predicate === 'string' && getTextEndIndex(node, predicate, 0) !== predicate.length) {
      return false;
    }
  }

  const value = node.textContent;

  return value !== null && (predicate === undefined ? value.length !== 0 : isMatchingValue(value, predicate));
}

/**
 * Returns `true` if the text content of the node isn't empty. Reads the same descendants as getTextContent does.
 */
function hasTextData(node: Node): boolean {
  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (isText(child) ? child.data.length !== 0 : isElement(child) && hasTextData(child)) {
      return true;
    }
  }
  return false;
}

/**
 * Checks that the text content of the node can be equal to the part of the text that starts at the index. Reads the
 * same descendants as getTextContent does, and stops at the first difference.
 *
 * Only the length and the first character of each text node are compared, since they differ for most texts, and they
 * are fast to compare. So the text content must still be compared to the text if this check passes.
 *
 * @returns The index in the text where the text content of the node ends, or -1 if the text content differs.
 */
function getTextEndIndex(node: Node, text: string, index: number): number {
  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (isText(child)) {
      const { data } = child;

      if (data.length === 0) {
        continue;
      }
      if (index + data.length > text.length || data.charCodeAt(0) !== text.charCodeAt(index)) {
        return -1;
      }
      index += data.length;
    } else if (isElement(child) && (index = getTextEndIndex(child, text, index)) === -1) {
      return -1;
    }
  }
  return index;
}

/**
 * Appends descendants of the root that are elements with the given namespace and local name.
 *
 * Descendants are read without a tree walker, which has to be created for each root, and the loop is in a function of
 * its own, since it is slower inside a function that has more variables.
 *
 * @param root The root whose descendants are read.
 * @param namespaceURI The namespace of elements.
 * @param localName The local name of elements.
 * @param elements The array to append elements to.
 */
function pushDescendants(root: Node, namespaceURI: string | null, localName: string, elements: Element[]): void {
  let node = root.firstChild;

  while (node !== null) {
    if (isElement(node) && hasTagNameNS(node, namespaceURI, localName)) {
      elements.push(node);
    }

    let nextNode = node.firstChild;

    if (nextNode === null) {
      // The node has no children, so the next node is the closest sibling that follows the node or its ancestor
      let ancestor: Node = node;

      while (ancestor !== root && (nextNode = ancestor.nextSibling) === null) {
        ancestor = ancestor.parentNode!;
      }
    }

    node = nextNode;
  }
}

/**
 * Returns the number of sibling elements that precede the element.
 *
 * @param element The element whose siblings are counted.
 * @param maxCount The walk stops as soon as there are more siblings. The returned count is then less than the actual
 * one, but it is still greater than the maximum, and so is the count of an element that reuses it.
 * @param lastElement The element whose count is reused if the walk reaches it, so a run of siblings is read once.
 * @param lastCount The count that was returned for the last element.
 */
function getPrecedingCount(element: Element, maxCount: number, lastElement: Element | null, lastCount: number): number {
  let count = 0;

  for (let sibling = element.previousSibling; sibling !== null; sibling = sibling.previousSibling) {
    if (sibling === lastElement) {
      return count + lastCount + 1;
    }
    if (isElement(sibling) && ++count > maxCount) {
      break;
    }
  }
  return count;
}

/**
 * Returns the number of sibling elements that follow the element. Does the same as {@link getPrecedingCount}, but in
 * the other direction.
 */
function getFollowingCount(element: Element, maxCount: number, lastElement: Element | null, lastCount: number): number {
  let count = 0;

  for (let sibling = element.nextSibling; sibling !== null; sibling = sibling.nextSibling) {
    if (sibling === lastElement) {
      return count + lastCount + 1;
    }
    if (isElement(sibling) && ++count > maxCount) {
      break;
    }
  }
  return count;
}

/**
 * Returns the closest element with the given namespace and local name, which is the node itself or its ancestor, or
 * `null` if there's no such element.
 */
function getClosestElement(node: Node, namespaceURI: string | null, localName: string): Element | null {
  for (let ancestor: Node | null = node; ancestor !== null; ancestor = ancestor.parentNode) {
    if (isElement(ancestor) && hasTagNameNS(ancestor, namespaceURI, localName)) {
      return ancestor;
    }
  }
  return null;
}

/**
 * Returns `true` if the root has a descendant that is an element with the given namespace and local name. Reads
 * descendants the same way as {@link pushDescendants} does, and stops at the first such descendant.
 */
function hasDescendant(root: Node, namespaceURI: string | null, localName: string): boolean {
  let node = root.firstChild;

  while (node !== null) {
    if (isElement(node) && hasTagNameNS(node, namespaceURI, localName)) {
      return true;
    }

    let nextNode = node.firstChild;

    if (nextNode === null) {
      // The node has no children, so the next node is the closest sibling that follows the node or its ancestor
      let ancestor: Node = node;

      while (ancestor !== root && (nextNode = ancestor.nextSibling) === null) {
        ancestor = ancestor.parentNode!;
      }
    }

    node = nextNode;
  }

  return false;
}

/**
 * Appends children of the parent that are elements with the given namespace and local name.
 *
 * @param parent The parent whose children are read.
 * @param excludedChild The child that isn't appended.
 * @param namespaceURI The namespace of elements.
 * @param localName The local name of elements.
 * @param elements The array to append elements to.
 */
function pushSiblings(
  parent: Node,
  excludedChild: Node | null,
  namespaceURI: string | null,
  localName: string,
  elements: Element[]
): void {
  for (let child = parent.firstChild; child !== null; child = child.nextSibling) {
    if (child !== excludedChild && isElement(child) && hasTagNameNS(child, namespaceURI, localName)) {
      elements.push(child);
    }
  }
}

/**
 * Adds the value to the set, and returns `true` if the set didn't have it. Reads the set once, unlike a check that is
 * followed by an addition.
 */
function addUnique<TValue>(valueSet: Set<TValue>, value: TValue): boolean {
  const { size } = valueSet;

  return valueSet.add(value).size !== size;
}

/**
 * Returns `true` if an ancestor of the node is in the set.
 */
function hasAncestor(node: Node, nodeSet: Set<Node>): boolean {
  for (let ancestor = node.parentNode; ancestor !== null; ancestor = ancestor.parentNode) {
    if (nodeSet.has(ancestor)) {
      return true;
    }
  }
  return false;
}
