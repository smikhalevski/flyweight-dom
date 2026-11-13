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

import { splitTokens } from './DOMTokenList.ts';
import type { Element } from './Element.ts';
import { hasClassNames } from './getElementsByClassName.ts';
import { hasTagNameNS } from './getElementsByTagNameNS.ts';
import type { Node } from './Node.ts';
import { SHOW_ELEMENT } from './NodeFilter.ts';
import { TreeWalker } from './TreeWalker.ts';
import { ELEMENT_NODE, getNextSiblingOrSelf, getPreviousSiblingOrSelf, isElement, isText } from './utils.ts';

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

    // A single node can't be nested, so the set isn't needed
    const nodeSet = nodes.length > 1 ? new Set<Node>(nodes) : null;
    const elements = [];

    for (const node of nodes) {
      // Descendants of a nested node are found when its ancestor is searched
      if (nodeSet !== null && hasAncestor(node, nodeSet)) {
        continue;
      }

      const treeWalker = new TreeWalker(node, SHOW_ELEMENT);

      for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
        if (hasTagNameNS(element, namespaceURI, localName)) {
          elements.push(element);
        }
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

      const value = node.getAttribute(name);

      if (value !== null && isMatchingValue(value, predicate)) {
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

    for (const node of this.nodes) {
      // An element doesn't have a class if no class name is given
      if (classNames.length !== 0 && isElement(node) && hasClassNames(node, classNames)) {
        elements.push(node);
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
    const elements = [];

    for (const node of this.nodes) {
      if (isElement(node) && isNthChild(node, index)) {
        elements.push(node);
      }
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
    const nodeSet = new Set<TNode | TOtherNode>(this.nodes);

    for (const node of query.nodes) {
      nodeSet.add(node);
    }

    return new NodeQuery(Array.from(nodeSet));
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
      const value = node.textContent;

      if (value !== null && (predicate === undefined ? value.length !== 0 : isMatchingValue(value, predicate))) {
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
      const treeWalker = new TreeWalker(node, SHOW_ELEMENT);

      for (let element: Element | null; (element = treeWalker.nextNode() as Element) !== null;) {
        if (hasTagNameNS(element, namespaceURI, localName)) {
          nodes.push(node);
          break;
        }
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
    const elementSet = new Set<Element>();

    for (const node of this.nodes) {
      const parent = node.parentNode;

      if (parent !== null && isElement(parent) && hasTagNameNS(parent, namespaceURI, localName)) {
        elementSet.add(parent);
      }
    }

    return new NodeQuery(Array.from(elementSet));
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
    // Ancestors that were read already, so the walk up from a node stops at an ancestor it shares with previous nodes
    const ancestorSet = new Set<Node>();
    const elements = [];

    for (const node of this.nodes) {
      for (
        let ancestor = node.parentNode;
        ancestor !== null && !ancestorSet.has(ancestor);
        ancestor = ancestor.parentNode
      ) {
        ancestorSet.add(ancestor);

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
    const elementSet = new Set<Element>();

    for (const node of this.nodes) {
      for (let ancestor: Node | null = node; ancestor !== null; ancestor = ancestor.parentNode) {
        if (isElement(ancestor) && hasTagNameNS(ancestor, namespaceURI, localName)) {
          elementSet.add(ancestor);
          break;
        }
      }
    }

    return new NodeQuery(Array.from(elementSet));
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
    // For each parent, the only child that is among nodes, or null if there are several, so each parent is read once
    const childMap = new Map<Node, Node | null>();

    for (const node of this.nodes) {
      const parent = node.parentNode;

      if (parent !== null) {
        childMap.set(parent, childMap.has(parent) ? null : node);
      }
    }

    const elements = [];

    for (const [parent, excludedChild] of childMap) {
      for (let child = parent.firstChild; child !== null; child = child.nextSibling) {
        if (child !== excludedChild && isElement(child) && hasTagNameNS(child, namespaceURI, localName)) {
          elements.push(child);
        }
      }
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
  nextAll(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    // Siblings that were read already, so the walk from a node stops at a sibling that follows a previous node
    const siblingSet = new Set<Node>();
    const elements = [];

    for (const node of this.nodes) {
      for (
        let sibling = node.nextSibling;
        sibling !== null && !siblingSet.has(sibling);
        sibling = sibling.nextSibling
      ) {
        siblingSet.add(sibling);

        if (isElement(sibling) && hasTagNameNS(sibling, namespaceURI, localName)) {
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
  previousAll(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    // Siblings that were read already, so the walk from a node stops at a sibling that precedes a previous node
    const siblingSet = new Set<Node>();
    const elements = [];

    for (const node of this.nodes) {
      for (
        let sibling = node.previousSibling;
        sibling !== null && !siblingSet.has(sibling);
        sibling = sibling.previousSibling
      ) {
        siblingSet.add(sibling);

        if (isElement(sibling) && hasTagNameNS(sibling, namespaceURI, localName)) {
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
 * Returns `true` if the element is at the index among its sibling elements. Siblings are counted from the first one for
 * a non-negative index, and from the last one for a negative index.
 */
function isNthChild(element: Element, index: number): boolean {
  const isReversed = index < 0;

  // The number of sibling elements that must be on the counted side of the element
  let siblingCount = isReversed ? -index - 1 : index;

  for (
    let sibling = isReversed ? element.nextElementSibling : element.previousElementSibling;
    sibling !== null;
    sibling = isReversed ? sibling.nextElementSibling : sibling.previousElementSibling
  ) {
    if (--siblingCount < 0) {
      return false;
    }
  }

  return siblingCount === 0;
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
