/**
 * The jQuery-style queries that select elements of a tree.
 *
 * ```ts
 * import { $ } from 'flyweight-dom/query';
 *
 * const $titles = $(document)
 *   .descendants('item')
 *   .children('title')
 *   .hasAttribute('lang', 'en');
 *
 * $titles.nodes;
 * // ⮕ [Element, Element]
 * ```
 *
 * @module flyweight-dom/query
 */

import type { ChildNode } from './ChildNode.ts';
import { splitTokens } from './DOMTokenList.ts';
import { hasClassNames as importedHasClassNames } from './getElementsByClassName.ts';
import { isMatchingName as importedIsMatchingName } from './getElementsByTagNameNS.ts';
import { getNextDescendantInDocumentOrder as importedGetNextDescendantInDocumentOrder } from './getNextDescendantInDocumentOrder.ts';
// Classes are imported from the main entry point, which evaluates modules of node classes in the order of their
// dependencies
import { DocumentFragment, Element } from './index.ts';
import type { Node } from './Node.ts';
import { uncheckedCompareDocumentPosition as importedUncheckedCompareDocumentPosition } from './uncheckedCompareDocumentPosition.ts';
import {
  DOCUMENT_POSITION_FOLLOWING,
  DOCUMENT_POSITION_PRECEDING,
  ELEMENT_NODE,
  getNextSiblingOrSelf as importedGetNextSiblingOrSelf,
  getPreviousSiblingOrSelf as importedGetPreviousSiblingOrSelf,
  hasOwnProperty as importedHasOwnProperty,
  isElement as importedIsElement,
  isText as importedIsText,
  iteratorPrototype,
  retainHiddenClasses,
} from './utils.ts';

// V8 checks an imported function at every call, but inlines a local constant without a check
const hasClassNames = importedHasClassNames;
const isMatchingName = importedIsMatchingName;
const getNextDescendantInDocumentOrder = importedGetNextDescendantInDocumentOrder;
const getNextSiblingOrSelf = importedGetNextSiblingOrSelf;
const getPreviousSiblingOrSelf = importedGetPreviousSiblingOrSelf;
const hasOwnProperty = importedHasOwnProperty;
const isElement = importedIsElement;
const isText = importedIsText;
const uncheckedCompareDocumentPosition = importedUncheckedCompareDocumentPosition;

/**
 * Creates a query that holds the given node, so its children and descendants can be selected.
 *
 * @param node The node where the query starts.
 * @template TNode The node where the query starts.
 * @group Query
 */
export function $<TNode extends Node>(node: TNode): NodeQuery<TNode>;

/**
 * Creates a query that holds the given nodes, so their children and descendants can be selected.
 *
 * Nodes are copied, so the query doesn't change with a live list or an array. Each node is held once, in its order.
 * Nodes of a tree must go in a row, see {@link NodeQuery}.
 *
 * @param nodes The nodes where the query starts.
 * @template TNode The node where the query starts.
 * @group Query
 */
export function $<TNode extends Node>(nodes: Iterable<TNode>): NodeQuery<TNode>;

// Overloads, since a single signature would infer the type of children of a parent node, which is iterable
export function $<TNode extends Node>(node: TNode | Iterable<TNode>): NodeQuery<TNode> {
  // A parent node is iterable too, so a node is told by its type
  if (isNode(node)) {
    return new NodeQuery([node]);
  }

  return new NodeQuery(Array.from(new Set(node)));
}

/**
 * Returns `true` if the value is a node.
 */
const isNode = (value: unknown): value is Node => {
  return typeof (value as Node).nodeType === 'number';
};

/**
 * The condition that an attribute value or a text must meet: the string that it must be equal to, or the regular
 * expression that it must match, or the callback that returns `true` for a suitable string.
 *
 * @group Query
 */
export type StringPredicate = string | RegExp | ((value: string) => boolean);

/**
 * Returns `true`, or a query that isn't empty, if the node must be selected. A query lets a predicate test the
 * surroundings of the node: `element => $(element).ancestors().hasClass('aaa')`.
 *
 * @param node The node to test.
 * @param index The index of the node in the query.
 * @template TNode The node to test.
 * @group Query
 */
export type NodePredicate<TNode extends Node> = (node: TNode, index: number) => NodeQuery<Node> | boolean;

/**
 * The list of selected nodes. A query isn't changed after it is created: each method returns a new query, so a query
 * can be reused as the start of other queries.
 *
 * Nodes are ordered as in jQuery: {@link ancestors} and {@link preceding} return the closest node first,
 * {@link children}, {@link next} and {@link previous} keep the order of nodes they were selected from, and other
 * methods return nodes in document order. Use {@link sort} to put nodes in document order.
 *
 * @template TNode The selected node.
 * @group Query
 */
export class NodeQuery<TNode extends Node = Element> implements Iterable<TNode> {
  /**
   * Creates a new instance of {@link NodeQuery}.
   *
   * @param nodes The selected nodes. The array isn't copied and must not contain the same node twice. Nodes of a tree
   * must go in a row, since a sort keeps the order of trees.
   */
  constructor(
    /**
     * The selected nodes.
     */
    readonly nodes: readonly TNode[]
  ) {}

  /**
   * `true` if {@link nodes} are known to be in document order, so they aren't checked or sorted again.
   */
  protected _isSorted = false;

  /**
   * Returns the number of {@link nodes}.
   */
  get length(): number {
    return this.nodes.length;
  }

  /**
   * Returns the first of {@link nodes}, or `null` if there are no nodes.
   */
  get node(): TNode | null {
    return this.nodes.length === 0 ? null : this.nodes[0];
  }

  /**
   * Returns the concatenated text content of {@link nodes}, or `null` if none of them has text content, such as when
   * the query is empty or selects only documents and doctypes.
   */
  get text(): string | null {
    let text: string | null = null;

    for (const node of this.nodes) {
      const { textContent } = node;

      if (textContent === null) {
        continue;
      }
      text = text === null ? textContent : text + textContent;
    }

    return text;
  }

  /**
   * Selects child elements of {@link nodes} that have the given local name and namespace, the same as the `>`
   * combinator in CSS.
   *
   * Children aren't sorted: they go in the order of {@link nodes}, so children of nested nodes aren't in document
   * order.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  children(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const elements = [];

    for (const node of this.nodes) {
      for (let child = node.firstChild; child !== null; child = child.nextSibling) {
        if (isElement(child) && isMatchingName(child, namespaceURI, localName)) {
          elements.push(child);
        }
      }
    }

    return createNodeQuery(elements, this.nodes.length === 1);
  }

  /**
   * Selects descendant elements of {@link nodes} that have the given local name and namespace, the same as the
   * descendant combinator in CSS.
   *
   * Each element is returned once, even if several of {@link nodes} contain it. Elements are in document order.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  descendants(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // Nodes that have children, since only they can contain other nodes
    const nodeSet = createSet(nodes);
    const elements: Element[] = [];

    if (nodeSet !== null) {
      for (const node of nodes) {
        if (node.firstChild !== null) {
          nodeSet.add(node);
        }
      }
    }

    let isSorted = true;

    for (const node of nodes) {
      // Descendants of a nested node are read along with its ancestor
      if (node.firstChild !== null && (nodeSet === null || !hasAncestor(node, nodeSet))) {
        const startIndex = elements.length;

        pushDescendantElements(node, namespaceURI, localName, elements);

        // Descendants of a node are sorted, so only the first one is compared with those before it. Descendants of
        // sorted nodes that don't contain each other are sorted too
        isSorted = isSorted && (this._isSorted || isTailFollowing(elements, startIndex));
      }
    }

    return createNodeQuery(isSorted ? elements : elements.sort(compareDocumentOrder), true);
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
      if (value !== undefined && hasOwnProperty(attributes, name) && isMatchingString(value, predicate)) {
        elements.push(node);
      }
    }

    return createNodeQuery(elements, this._isSorted);
  }

  /**
   * Selects elements from {@link nodes} that have the attribute with the given namespace and local name, whatever its
   * prefix is, the same as the `[ns|name]` selector in CSS.
   *
   * @param namespaceURI The namespace of the attribute, or `null` for an attribute without a namespace. The special
   * string `*` represents all namespaces, including no namespace, the same as `[*|name]` in CSS.
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

      const value =
        namespaceURI === '*' ? getAttributeAnyNS(node, localName) : node.getAttributeNS(namespaceURI, localName);

      if (value !== null && isMatchingString(value, predicate)) {
        elements.push(node);
      }
    }

    return createNodeQuery(elements, this._isSorted);
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

    return createNodeQuery(elements, this._isSorted);
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
    // Previous siblings are counted for an index from the first child, and next siblings for an index from the last one
    const isPrevious = index >= 0;

    // The number of sibling elements that must precede the element, or follow it if the index is negative
    const siblingCount = isPrevious ? index : -index - 1;
    const elements = [];

    if (siblingCount === 0) {
      // The first or the last child has no sibling element on its side, which is the fastest to check
      for (const node of nodes) {
        if (isElement(node) && (isPrevious ? node.previousElementSibling : node.nextElementSibling) === null) {
          elements.push(node);
        }
      }

      return createNodeQuery(elements, this._isSorted);
    }

    // The count of the last element is reused when a walk reaches it, so a run of siblings is read once. For a negative
    // index, siblings are counted towards the last child, so nodes are read from the last one
    let lastElement: Element | null = null;
    let lastCount = 0;

    for (let i = 0; i < nodes.length; ++i) {
      const node = nodes[isPrevious ? i : nodes.length - i - 1];

      if (!isElement(node)) {
        continue;
      }

      const count = getSiblingElementCount(node, isPrevious, siblingCount, lastElement, lastCount);

      lastElement = node;
      lastCount = count;

      if (count === siblingCount) {
        elements.push(node);
      }
    }

    if (!isPrevious) {
      elements.reverse();
    }

    return createNodeQuery(elements, this._isSorted);
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
   * Selects elements from {@link nodes} that are the only element children of their parents, the same as the
   * `:only-child` selector in CSS.
   */
  onlyChild(): NodeQuery {
    const elements = [];

    for (const node of this.nodes) {
      if (isElement(node) && node.previousElementSibling === null && node.nextElementSibling === null) {
        elements.push(node);
      }
    }

    return createNodeQuery(elements, this._isSorted);
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

    return createNodeQuery(nodes, this._isSorted);
  }

  /**
   * Selects {@link nodes} and nodes of the other query, the same as the `,` in a CSS selector. Each node is returned
   * once, even if both queries have it. Nodes are in document order.
   *
   * Nodes of trees that only the other query has go last.
   *
   * @param query The query to add nodes from.
   * @template TOtherNode The node of the other query.
   */
  union<TOtherNode extends Node>(query: NodeQuery<TOtherNode>): NodeQuery<TNode | TOtherNode> {
    let { nodes } = this;
    let otherNodes = query.nodes;

    if (otherNodes.length === 0 || nodes.length === 0) {
      return (nodes.length === 0 ? query : this).sort();
    }

    const root = nodes[0].getRootNode();

    // Nodes of a tree go in a row in each query, but may not after the join if there are several trees
    if (
      root !== nodes[nodes.length - 1].getRootNode() ||
      root !== otherNodes[0].getRootNode() ||
      root !== otherNodes[otherNodes.length - 1].getRootNode()
    ) {
      return createNodeQuery(
        groupByTree(Array.from(new Set([...nodes, ...otherNodes]))).sort(compareDocumentOrder),
        true
      ) as NodeQuery<TNode | TOtherNode>;
    }

    // Nodes of each query are sorted and merged, which is faster than a sort of all nodes
    if (!isSortedQuery(this)) {
      nodes = sortNodesInDocumentOrder(nodes.slice());
    }
    if (!isSortedQuery(query)) {
      otherNodes = sortNodesInDocumentOrder(otherNodes.slice());
    }

    return createNodeQuery(mergeNodesInDocumentOrder(nodes, otherNodes), true) as NodeQuery<TNode | TOtherNode>;
  }

  /**
   * Returns a query that holds {@link nodes} in document order. Use it after methods that don't sort nodes, such as
   * {@link children}, or to start {@link ancestors} with the farthest one:
   *
   * ```ts
   * // The outermost section that contains the heading
   * $(heading).ancestors('section').sort().first();
   * ```
   *
   * Nodes of different trees have no order, so trees go in the order of their first nodes.
   */
  sort(): NodeQuery<TNode> {
    // A sort keeps the order of trees, so nodes of each tree are put in a row first. Arrays of nodes are never changed,
    // so sorted nodes are shared
    return createNodeQuery(isSortedQuery(this) ? this.nodes : sortNodesInDocumentOrder(groupByTree(this.nodes)), true);
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
      if (hasMatchingTextContent(node, predicate)) {
        nodes.push(node);
      }
    }

    return createNodeQuery(nodes, this._isSorted);
  }

  /**
   * Selects {@link nodes} that pass the predicate.
   *
   * @param predicate Returns `true`, or a query that isn't empty, if the node must be selected.
   */
  filter(predicate: NodePredicate<TNode>): NodeQuery<TNode> {
    const nodes = [];

    for (let i = 0; i < this.nodes.length; ++i) {
      const result: unknown = predicate(this.nodes[i], i);

      if (result === true || (result instanceof NodeQuery && result.nodes.length !== 0)) {
        nodes.push(this.nodes[i]);
      }
    }

    return createNodeQuery(nodes, this._isSorted);
  }

  /**
   * Selects {@link nodes} that don't pass the predicate, the same as the `:not()` selector in CSS.
   *
   * @param predicate Returns `true`, or a query that isn't empty, if the node must not be selected.
   */
  not(predicate: NodePredicate<TNode>): NodeQuery<TNode> {
    const nodes = [];

    for (let i = 0; i < this.nodes.length; ++i) {
      const result: unknown = predicate(this.nodes[i], i);

      if (result !== true && !(result instanceof NodeQuery && result.nodes.length !== 0)) {
        nodes.push(this.nodes[i]);
      }
    }

    return createNodeQuery(nodes, this._isSorted);
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
      if (hasDescendantElement(node, namespaceURI, localName)) {
        nodes.push(node);
      }
    }

    return createNodeQuery(nodes, this._isSorted);
  }

  /**
   * Selects parent elements of {@link nodes} that have the given local name and namespace.
   *
   * Each element is returned once, even if it is the parent of several of {@link nodes}. Elements are in document
   * order.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  parent(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;
    const nodeSet = createSet(nodes);
    const elements = [];

    let lastParent: Node | null = null;

    for (const node of nodes) {
      const parent = node.parentNode;

      // Siblings usually go in a row, so the parent of the last node is checked before the set
      if (
        parent !== null &&
        parent !== lastParent &&
        isElement(parent) &&
        isMatchingName(parent, namespaceURI, localName) &&
        addUnique(nodeSet, parent)
      ) {
        elements.push(parent);
      }

      lastParent = parent;
    }

    return createNodeQuery(sortNodesInDocumentOrder(elements), true);
  }

  /**
   * Selects ancestor elements of {@link nodes} that have the given local name and namespace.
   *
   * Each element is returned once, even if it is an ancestor of several of {@link nodes}. Elements are in reverse
   * document order, so the closest ancestor goes first. Use {@link sort} to start with the farthest one.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  ancestors(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;

    // Ancestors that were read already, where the walk up from the next node stops
    const nodeSet = createSet(nodes);
    const elements = [];

    let lastParent: Node | null = null;

    for (const node of nodes) {
      // Siblings usually go in a row, and ancestors of the last node were read already
      if (node.parentNode === lastParent) {
        continue;
      }

      lastParent = node.parentNode;

      const startIndex = elements.length;

      // The set is checked for null here, since it is measurably faster in this loop than the check in addUnique
      for (
        let ancestor = lastParent;
        ancestor !== null && (nodeSet === null || addUnique(nodeSet, ancestor));
        ancestor = ancestor.parentNode
      ) {
        if (isElement(ancestor) && isMatchingName(ancestor, namespaceURI, localName)) {
          elements.push(ancestor);
        }
      }

      // Ancestors of a single node are in order already. Otherwise, each group is put in document order, so ancestors
      // are sorted only if groups are out of order
      if (nodeSet !== null) {
        reverseTail(elements, startIndex);
      }
    }

    return new NodeQuery(nodeSet === null ? elements : sortNodesInDocumentOrder(elements).reverse());
  }

  /**
   * For each of {@link nodes}, selects the closest element with the given local name and namespace, which is the node
   * itself or its ancestor.
   *
   * Each element is returned once, even if it is the closest one for several of {@link nodes}. Elements are in document
   * order.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  closest(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;
    const nodeSet = createSet(nodes);
    const elements = [];

    let lastElement: Element | null = null;

    for (const node of nodes) {
      const element = getClosestElement(node, namespaceURI, localName);

      // Nodes with the same closest element usually go in a row, so the last one is checked before the set. A node
      // without children is the closest element only for itself
      if (
        element !== null &&
        element !== lastElement &&
        ((element === (node as Node) && node.firstChild === null) || addUnique(nodeSet, element))
      ) {
        elements.push(element);
      }

      lastElement = element;
    }

    return createNodeQuery(sortNodesInDocumentOrder(elements), true);
  }

  /**
   * Selects sibling elements of {@link nodes} that have the given local name and namespace. A node isn't its own
   * sibling, so it is selected only if another of {@link nodes} has the same parent. Elements are in document order.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  siblings(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    const { nodes } = this;
    const elements: Element[] = [];

    if (nodes.length === 1) {
      // A single node shares its parent with no other node, so the map isn't needed
      const node = nodes[0];

      if (node.parentNode !== null) {
        pushSiblingElements(node.parentNode, node, namespaceURI, localName, elements);
      }
      return createNodeQuery(elements, true);
    }

    // The only child among nodes for each parent, or null if there are several
    const excludedChildMap = new Map<Node, Node | null>();

    let lastParent: Node | null = null;

    // `true` if the last parent has several children in the map
    let isLastParentShared = false;

    for (const node of nodes) {
      const parent = node.parentNode;

      if (parent === null) {
        continue;
      }

      // Siblings usually go in a row, so the parent of the last node is checked before the map
      if (parent === lastParent) {
        if (!isLastParentShared) {
          excludedChildMap.set(parent, null);
          isLastParentShared = true;
        }
        continue;
      }

      lastParent = parent;

      const child = excludedChildMap.get(parent);

      // The map is written only if the value changes, since reading it is faster
      if (child === undefined) {
        excludedChildMap.set(parent, node);
        isLastParentShared = false;
      } else {
        if (child !== null) {
          excludedChildMap.set(parent, null);
        }
        isLastParentShared = true;
      }
    }

    // There are fewer parents than siblings, so parents are sorted instead
    pushSiblingElementsInDocumentOrder(
      sortNodesInDocumentOrder(Array.from(excludedChildMap.keys())),
      excludedChildMap,
      namespaceURI,
      localName,
      elements
    );

    return createNodeQuery(elements, true);
  }

  /**
   * For each of {@link nodes}, selects the next sibling element if it has the given local name and namespace, the same
   * as the `+` combinator in CSS.
   *
   * Each element is returned once, even if it is the next sibling of several of {@link nodes}. Elements aren't sorted:
   * they go in the order of {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  next(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    return new NodeQuery(getNextOrPreviousElements(this.nodes, false, namespaceURI, localName));
  }

  /**
   * For each of {@link nodes}, selects the previous sibling element if it has the given local name and namespace.
   *
   * Each element is returned once, even if it is the previous sibling of several of {@link nodes}. Elements aren't
   * sorted: they go in the order of {@link nodes}.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  previous(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    return new NodeQuery(getNextOrPreviousElements(this.nodes, true, namespaceURI, localName));
  }

  /**
   * Selects sibling elements that follow {@link nodes} and have the given local name and namespace, the same as the `~`
   * combinator in CSS.
   *
   * Each element is returned once, even if it follows several of {@link nodes}. Elements are in document order.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  following(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    return createNodeQuery(getFollowingOrPrecedingElements(this.nodes, false, namespaceURI, localName), true);
  }

  /**
   * Selects sibling elements that precede {@link nodes} and have the given local name and namespace.
   *
   * Each element is returned once, even if it precedes several of {@link nodes}. Elements are in reverse document
   * order, so the closest sibling goes first. Use {@link sort} to start with the farthest one.
   *
   * @param localName The local name of elements. The special string `*` represents all elements.
   * @param namespaceURI The namespace of elements, or `null` for elements without a namespace. The special string `*`
   * represents all namespaces.
   */
  preceding(localName = '*', namespaceURI: string | null = '*'): NodeQuery {
    return new NodeQuery(getFollowingOrPrecedingElements(this.nodes, true, namespaceURI, localName));
  }

  /**
   * Returns the attribute value of the first of {@link nodes}, or `null` if it has no such attribute, or isn't an
   * element, or there are no nodes.
   *
   * @param name The qualified name of the attribute.
   */
  getAttribute(name: string): string | null {
    if (this.nodes.length === 0) {
      return null;
    }

    const node = this.nodes[0];

    return isElement(node) ? node.getAttribute(name) : null;
  }

  /**
   * Returns the value of the attribute with the given namespace and local name of the first of {@link nodes}, or
   * `null` if it has no such attribute, or isn't an element, or there are no nodes.
   *
   * @param namespaceURI The namespace of the attribute, or `null` for an attribute without a namespace.
   * @param localName The local name of the attribute.
   */
  getAttributeNS(namespaceURI: string | null, localName: string): string | null {
    if (this.nodes.length === 0) {
      return null;
    }

    const node = this.nodes[0];

    return isElement(node) ? node.getAttributeNS(namespaceURI, localName) : null;
  }

  /**
   * Removes {@link nodes} from their parents. Removed nodes stay in the query, so they can be inserted elsewhere.
   */
  remove(): this {
    for (const node of this.nodes) {
      node.parentNode?.removeChild(node);
    }

    return this;
  }

  /**
   * Returns an iterator over queries that hold one of {@link nodes} each, so a loop can query from each node:
   *
   * ```ts
   * for (const $item of $(document).descendants('item').queries()) {
   *   $item.children('title').text;
   * }
   * ```
   *
   * Queries are created as the iterator reaches them, so a loop that stops early doesn't create the rest.
   */
  queries(): IteratorObject<NodeQuery<TNode>> {
    return new NodeQueryIterator(this.nodes);
  }

  [Symbol.iterator](): IteratorObject<TNode> {
    return this.nodes[Symbol.iterator]();
  }
}

/**
 * Returns the value of the attribute with the given local name in any namespace or in no namespace, or `null` if the
 * element has no such attribute. If several attributes match, the value of the first one is returned.
 */
const getAttributeAnyNS = (element: Element, localName: string): string | null => {
  const { attributes } = element;

  for (const name in attributes) {
    // The index of the colon that separates the prefix from the local name
    const index = name.length - localName.length - 1;

    if (index === -1) {
      // An attribute without a prefix, or with a prefix that isn't bound, has no namespace, and its local name is the
      // whole name, the same as in Element.getAttributeNS
      const colonIndex = name.indexOf(':');

      if (
        name === localName &&
        (colonIndex === -1 || element.lookupNamespaceURI(name.substring(0, colonIndex)) === null)
      ) {
        return attributes[name];
      }
      continue;
    }

    if (
      index > 0 &&
      name.indexOf(':') === index &&
      name.endsWith(localName) &&
      element.lookupNamespaceURI(name.substring(0, index)) !== null
    ) {
      return attributes[name];
    }
  }

  return null;
};

/**
 * The iterator over queries that hold one node each, which {@link NodeQuery.queries} returns.
 */
class NodeQueryIterator<TNode extends Node> {
  private _nodes;
  private _index = 0;

  constructor(nodes: readonly TNode[]) {
    this._nodes = nodes;
  }

  next(): IteratorResult<NodeQuery<TNode>, undefined> {
    if (this._index < this._nodes.length) {
      return { value: new NodeQuery([this._nodes[this._index++]]), done: false };
    }

    return { value: undefined, done: true };
  }

  [Symbol.iterator](): this {
    return this;
  }
}

Object.setPrototypeOf(NodeQueryIterator.prototype, iteratorPrototype);

/**
 * Declares the members that {@link NodeQueryIterator} inherits from the iterator prototype.
 */
interface NodeQueryIterator<TNode extends Node> extends IteratorObject<NodeQuery<TNode>> {}

retainHiddenClasses(new NodeQuery([]), new NodeQueryIterator([]));

/**
 * Returns `true` if the string meets the predicate.
 */
const isMatchingString = (value: string, predicate: StringPredicate | undefined): boolean => {
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
};

/**
 * Returns `true` if the node has neither child elements nor text with data. Comments and processing instructions
 * don't count, the same as for the `:empty` selector in CSS.
 */
const hasNoContent = (node: Node): boolean => {
  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (isElement(child) || (isText(child) && child.data.length !== 0)) {
      return false;
    }
  }
  return true;
};

/**
 * Returns `true` if the text content of the node meets the predicate.
 */
const hasMatchingTextContent = (node: Node, predicate: StringPredicate | undefined): boolean => {
  // The text content of an element is the text of its descendants, and it is slow to concatenate. So descendants are
  // read first to tell whether there's any text, or whether the text can be equal to the string. Subclasses may have
  // their own text content, so their getter is always called
  if (node.constructor === Element || node.constructor === DocumentFragment) {
    if (predicate === undefined) {
      return hasTextContent(node);
    }

    if (typeof predicate === 'string' && getTextContentEndIndex(node, predicate, 0) !== predicate.length) {
      return false;
    }
  }

  const { textContent } = node;

  return (
    textContent !== null &&
    (predicate !== undefined ? isMatchingString(textContent, predicate) : textContent.length !== 0)
  );
};

/**
 * Returns `true` if the text content of the node isn't empty. Reads the same descendants as {@link getTextContent} does.
 */
const hasTextContent = (node: Node): boolean => {
  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (isText(child) ? child.data.length !== 0 : isElement(child) && hasTextContent(child)) {
      return true;
    }
  }
  return false;
};

/**
 * Quickly checks whether the text content of the node can equal the expected text, without concatenating it.
 *
 * Compares only the length and the first character of each text node, so a passed check still needs a full
 * comparison.
 *
 * @param node The node whose text content is checked.
 * @param expectedText The text that the text content must equal.
 * @param startIndex The index in the expected text where the text content of the node starts.
 * @returns The index in the expected text where the text content of the node ends, or -1 if they can't be equal.
 */
const getTextContentEndIndex = (node: Node, expectedText: string, startIndex: number): number => {
  for (let child = node.firstChild; child !== null; child = child.nextSibling) {
    if (isText(child)) {
      const { data } = child;

      if (data.length === 0) {
        continue;
      }

      if (
        startIndex + data.length > expectedText.length ||
        data.charCodeAt(0) !== expectedText.charCodeAt(startIndex)
      ) {
        return -1;
      }

      startIndex += data.length;
      continue;
    }

    if (isElement(child) && (startIndex = getTextContentEndIndex(child, expectedText, startIndex)) === -1) {
      return -1;
    }
  }

  return startIndex;
};

/**
 * Returns the previous sibling of the node, or the next one.
 */
const getSibling = (node: Node, isPrevious: boolean): ChildNode | null => {
  return isPrevious ? node.previousSibling : node.nextSibling;
};

/**
 * Returns sibling elements with the given namespace and local name that follow nodes in document order, or that precede
 * them in reverse document order.
 */
const getFollowingOrPrecedingElements = (
  nodes: readonly Node[],
  isPrevious: boolean,
  namespaceURI: string | null,
  localName: string
): Element[] => {
  // Siblings that were read already, where the walk from the next node stops
  const nodeSet = createSet(nodes);
  const elements = [];

  let isSorted = true;

  for (const node of nodes) {
    const startIndex = elements.length;

    for (let sibling = getSibling(node, isPrevious); sibling !== null; sibling = getSibling(sibling, isPrevious)) {
      if (!isElement(sibling)) {
        continue;
      }

      // All siblings after a sibling that was read, were read too
      if (!addUnique(nodeSet, sibling)) {
        break;
      }

      if (isMatchingName(sibling, namespaceURI, localName)) {
        elements.push(sibling);
      }
    }

    // Siblings of a single node are in order already
    if (nodeSet === null) {
      continue;
    }
    if (isPrevious) {
      // Each group is put in document order, so siblings are sorted only if groups are out of order
      reverseTail(elements, startIndex);
    } else {
      // A check of each group is faster than the check of all siblings
      isSorted = isSorted && isTailFollowing(elements, startIndex);
    }
  }

  if (nodeSet === null) {
    return elements;
  }
  if (isPrevious) {
    return sortNodesInDocumentOrder(elements).reverse();
  }
  return isSorted ? elements : elements.sort(compareDocumentOrder);
};

/**
 * Returns the next sibling element of each node, or the previous one, if it has the given namespace and local name.
 * Elements go in the order of nodes.
 */
const getNextOrPreviousElements = (
  nodes: readonly Node[],
  isPrevious: boolean,
  namespaceURI: string | null,
  localName: string
): Element[] => {
  // Only a node that isn't an element can share its closest sibling element with another node, so elements are tracked
  // from such a node on
  let elementSet: Set<Node> | null = null;

  const elements = [];

  for (const node of nodes) {
    if (elementSet === null && !isElement(node)) {
      elementSet = new Set(elements);
    }

    const element = (
      isPrevious
        ? getPreviousSiblingOrSelf(node.previousSibling, ELEMENT_NODE)
        : getNextSiblingOrSelf(node.nextSibling, ELEMENT_NODE)
    ) as Element | null;

    if (element !== null && isMatchingName(element, namespaceURI, localName) && addUnique(elementSet, element)) {
      elements.push(element);
    }
  }

  return elements;
};

/**
 * Returns the number of sibling elements that precede the element, or that follow it.
 *
 * @param element The element whose siblings are counted.
 * @param isPrevious `true` to count siblings that precede the element, or `false` to count siblings that follow it.
 * @param maxCount The walk stops as soon as there are more siblings. The returned count is then less than the actual
 * one, but it is still greater than the maximum, and so is the count of an element that reuses it.
 * @param lastElement The element whose count is reused if the walk reaches it, so a run of siblings is read once.
 * @param lastCount The count that was returned for the last element.
 */
const getSiblingElementCount = (
  element: Element,
  isPrevious: boolean,
  maxCount: number,
  lastElement: Element | null,
  lastCount: number
): number => {
  let count = 0;

  for (let sibling = getSibling(element, isPrevious); sibling !== null; sibling = getSibling(sibling, isPrevious)) {
    if (sibling === lastElement) {
      return count + lastCount + 1;
    }
    if (isElement(sibling) && ++count > maxCount) {
      break;
    }
  }
  return count;
};

/**
 * Returns the closest element with the given namespace and local name, which is the node itself or its ancestor, or
 * `null` if there's no such element.
 */
const getClosestElement = (node: Node, namespaceURI: string | null, localName: string): Element | null => {
  for (let ancestor: Node | null = node; ancestor !== null; ancestor = ancestor.parentNode) {
    if (isElement(ancestor) && isMatchingName(ancestor, namespaceURI, localName)) {
      return ancestor;
    }
  }
  return null;
};

/**
 * Returns `true` if the root has a descendant that is an element with the given namespace and local name.
 */
const hasDescendantElement = (root: Node, namespaceURI: string | null, localName: string): boolean => {
  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    if (isElement(node) && isMatchingName(node, namespaceURI, localName)) {
      return true;
    }
  }
  return false;
};

/**
 * Returns a negative number if the node precedes the other node in document order, or a positive number if it follows
 * the other node, or 0 if nodes are the same.
 *
 * 0 is also returned for nodes of different trees, so a sort keeps the order of trees if nodes of a tree go in a row.
 */
const compareDocumentOrder = (node: Node, otherNode: Node): number => {
  const position = uncheckedCompareDocumentPosition(node, otherNode);

  if ((position & DOCUMENT_POSITION_FOLLOWING) !== 0) {
    return -1;
  }
  if ((position & DOCUMENT_POSITION_PRECEDING) !== 0) {
    return 1;
  }
  return 0;
};

/**
 * Creates a query, and tells whether its nodes are known to be in document order.
 */
const createNodeQuery = <TNode extends Node>(nodes: readonly TNode[], isSorted: boolean): NodeQuery<TNode> => {
  const query = new NodeQuery(nodes);

  query['_isSorted'] = isSorted;

  return query;
};

/**
 * Returns `true` if nodes of the query are known to be in document order.
 */
const isSortedQuery = (query: NodeQuery<Node>): boolean => {
  return query.nodes.length < 2 || query['_isSorted'];
};

/**
 * Sorts nodes in document order, in place. Nodes are often sorted already, which is checked much faster than they are
 * sorted.
 *
 * @param nodes Nodes where nodes of a tree go in a row.
 */
const sortNodesInDocumentOrder = <TNode extends Node>(nodes: TNode[]): TNode[] => {
  for (let i = 1; i < nodes.length; ++i) {
    if (compareDocumentOrder(nodes[i - 1], nodes[i]) > 0) {
      return nodes.sort(compareDocumentOrder);
    }
  }
  return nodes;
};

/**
 * Returns nodes of both arrays in document order, each node once.
 *
 * @param nodes Nodes of a single tree in document order.
 * @param otherNodes Nodes of the same tree in document order.
 */
const mergeNodesInDocumentOrder = (nodes: readonly Node[], otherNodes: readonly Node[]): Node[] => {
  // Nodes of queries often go one after the other, and then they aren't compared one by one
  if (compareDocumentOrder(nodes[nodes.length - 1], otherNodes[0]) < 0) {
    return nodes.concat(otherNodes);
  }
  if (compareDocumentOrder(otherNodes[otherNodes.length - 1], nodes[0]) < 0) {
    return otherNodes.concat(nodes);
  }

  const mergedNodes = [];

  let i = 0;
  let j = 0;

  while (i < nodes.length && j < otherNodes.length) {
    const node = nodes[i];
    const otherNode = otherNodes[j];

    if (node === otherNode) {
      mergedNodes.push(node);
      ++i;
      ++j;
    } else if (compareDocumentOrder(node, otherNode) < 0) {
      mergedNodes.push(node);
      ++i;
    } else {
      mergedNodes.push(otherNode);
      ++j;
    }
  }

  for (; i < nodes.length; ++i) {
    mergedNodes.push(nodes[i]);
  }
  for (; j < otherNodes.length; ++j) {
    mergedNodes.push(otherNodes[j]);
  }

  return mergedNodes;
};

/**
 * Appends child elements of parents with the given namespace and local name in document order, except the excluded
 * child of each parent.
 *
 * Children of a nested parent are read right after the child that contains it.
 *
 * @param parents Parents in document order.
 * @param excludedChildMap The excluded child for each parent, or `null` if there's none.
 * @param namespaceURI The namespace of elements.
 * @param localName The local name of elements.
 * @param elements The array to append elements to.
 */
const pushSiblingElementsInDocumentOrder = (
  parents: readonly Node[],
  excludedChildMap: Map<Node, Node | null>,
  namespaceURI: string | null,
  localName: string,
  elements: Element[]
): void => {
  // Children that contain the next parent, whose siblings are read after children of that parent
  const childStack: Node[] = [];

  // Stale children above the stack size are overwritten instead of removed
  let stackSize = 0;

  for (let parentIndex = 0; parentIndex < parents.length;) {
    let parent = parents[parentIndex++];
    let excludedChild = excludedChildMap.get(parent);
    let anchorChild = parentIndex < parents.length ? getContainingChild(parent, parents[parentIndex]) : null;
    let child: Node | null = parent.firstChild;

    while (true) {
      if (child === null) {
        if (stackSize === 0) {
          break;
        }

        // The child was read already, but it can contain the next parent too
        child = childStack[--stackSize];
        parent = child.parentNode!;
        excludedChild = excludedChildMap.get(parent);
        anchorChild = parentIndex < parents.length ? getContainingChild(parent, parents[parentIndex]) : null;
      } else if (child !== excludedChild && isElement(child) && isMatchingName(child, namespaceURI, localName)) {
        elements.push(child);
      }

      if (child !== anchorChild) {
        child = child.nextSibling;
        continue;
      }

      childStack[stackSize++] = child;

      parent = parents[parentIndex++];
      excludedChild = excludedChildMap.get(parent);
      anchorChild = parentIndex < parents.length ? getContainingChild(parent, parents[parentIndex]) : null;
      child = parent.firstChild;
    }
  }
};

/**
 * Returns the child of the parent that contains the node or is the node itself, or `null` if the parent doesn't
 * contain the node.
 */
const getContainingChild = (parent: Node, node: Node): Node | null => {
  // Parents are usually siblings, and a node doesn't contain its sibling
  if (node.parentNode === parent.parentNode) {
    return null;
  }

  for (let ancestor = node; ancestor.parentNode !== null; ancestor = ancestor.parentNode) {
    if (ancestor.parentNode === parent) {
      return ancestor;
    }
  }
  return null;
};

/**
 * Returns `true` if elements appended from the start index follow the element before them, or if there are none.
 * Elements appended in sorted groups are all sorted if this holds for each group.
 */
const isTailFollowing = (elements: readonly Node[], startIndex: number): boolean => {
  return (
    startIndex === 0 ||
    startIndex === elements.length ||
    compareDocumentOrder(elements[startIndex - 1], elements[startIndex]) < 0
  );
};

/**
 * Reverses elements from the start index to the end of the array, in place.
 */
const reverseTail = (elements: Element[], startIndex: number): void => {
  for (let i = startIndex, j = elements.length - 1; i < j; ++i, --j) {
    const element = elements[i];

    elements[i] = elements[j];
    elements[j] = element;
  }
};

/**
 * Returns nodes where nodes of a tree go in a row. Trees go in the order of their first nodes, and nodes of a tree
 * keep their order.
 */
const groupByTree = <TNode extends Node>(nodes: readonly TNode[]): TNode[] => {
  const treeNodesMap = new Map<Node, TNode[]>();

  for (const node of nodes) {
    const root = node.getRootNode();
    const treeNodes = treeNodesMap.get(root);

    if (treeNodes === undefined) {
      treeNodesMap.set(root, [node]);
    } else {
      treeNodes.push(node);
    }
  }

  return Array.from(treeNodesMap.values()).flat();
};

/**
 * Returns `true` if an ancestor of the node is in the set.
 */
const hasAncestor = (node: Node, nodeSet: Set<Node>): boolean => {
  for (let ancestor = node.parentNode; ancestor !== null; ancestor = ancestor.parentNode) {
    if (nodeSet.has(ancestor)) {
      return true;
    }
  }
  return false;
};

/**
 * Appends descendants of the root that are elements with the given namespace and local name. The loop is in a function
 * of its own, since it is slower inside a function that has more variables.
 */
const pushDescendantElements = (
  root: Node,
  namespaceURI: string | null,
  localName: string,
  elements: Element[]
): void => {
  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    if (isElement(node) && isMatchingName(node, namespaceURI, localName)) {
      elements.push(node);
    }
  }
};

/**
 * Appends children of the parent that are elements with the given namespace and local name.
 *
 * @param parent The parent whose children are read.
 * @param excludedChild The child that isn't appended.
 * @param namespaceURI The namespace of elements.
 * @param localName The local name of elements.
 * @param elements The array to append elements to.
 */
const pushSiblingElements = (
  parent: Node,
  excludedChild: Node | null,
  namespaceURI: string | null,
  localName: string,
  elements: Element[]
): void => {
  for (let child = parent.firstChild; child !== null; child = child.nextSibling) {
    if (child !== excludedChild && isElement(child) && isMatchingName(child, namespaceURI, localName)) {
      elements.push(child);
    }
  }
};

/**
 * Returns a new set if there are several nodes, or `null` if there's a single node. A single node has no other node to
 * share parents, ancestors or siblings with, so a set that tells which of them were read already isn't needed.
 */
const createSet = (nodes: readonly Node[]): Set<Node> | null => {
  return nodes.length > 1 ? new Set() : null;
};

/**
 * Adds the node to the set, and returns `true` if the set didn't have it, or if there's no set. Reads the set once,
 * unlike a check that is followed by an addition.
 */
const addUnique = (nodeSet: Set<Node> | null, node: Node): boolean => {
  return nodeSet === null || nodeSet.size !== nodeSet.add(node).size;
};
