export type InsertPosition = 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';

export interface ValueAccessor {
  get(): string;

  set(value: string): void;
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node Node} on MDN
 */
export declare abstract class Node {
  static readonly ELEMENT_NODE: number;
  static readonly ATTRIBUTE_NODE: number;
  static readonly TEXT_NODE: number;
  static readonly CDATA_SECTION_NODE: number;
  static readonly PROCESSING_INSTRUCTION_NODE: number;
  static readonly COMMENT_NODE: number;
  static readonly DOCUMENT_NODE: number;
  static readonly DOCUMENT_TYPE_NODE: number;
  static readonly DOCUMENT_FRAGMENT_NODE: number;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType Node.nodeType} on MDN
   */
  readonly nodeType: number;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName Node.nodeName} on MDN
   */
  readonly nodeName: string;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode Node.parentNode} on MDN
   */
  readonly parentNode: ParentNode | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement Node.parentElement} on MDN
   */
  readonly parentElement: Element | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling Node.previousSibling} on MDN
   */
  readonly previousSibling: ChildNode | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling Node.nextSibling} on MDN
   */
  readonly nextSibling: ChildNode | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild Node.firstChild} on MDN
   */
  readonly firstChild: ChildNode | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild Node.lastChild} on MDN
   */
  readonly lastChild: ChildNode | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes Node.childNodes} on MDN
   */
  readonly childNodes: readonly ChildNode[];

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue Node.nodeValue} on MDN
   */
  nodeValue: string | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent Node.textContent} on MDN
   */
  textContent: string | null;

  static extend(constructor: new (...args: any[]) => any): void;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes Node.hasChildNodes} on MDN
   */
  hasChildNodes(): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild Node.appendChild} on MDN
   */
  appendChild<T extends Node>(node: T): T;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore Node.insertBefore} on MDN
   */
  insertBefore<T extends Node>(node: T, child: Node | null | undefined): T;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/contains Node.contains} on MDN
   */
  contains(node: Node | null | undefined): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild Node.removeChild} on MDN
   */
  removeChild<T extends Node>(child: T): T;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild Node.replaceChild} on MDN
   */
  replaceChild<T extends Node>(node: Node, child: T): T;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/isEqualNode Node.isEqualNode} on MDN
   */
  isEqualNode(otherNode: Node | null | undefined): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode Node.cloneNode} on MDN
   */
  cloneNode(deep?: boolean): Node;
}

export interface ChildNode extends Node {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling Element.nextElementSibling} on MDN
   */
  readonly nextElementSibling: Element | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling Element.previousElementSibling} on MDN
   */
  readonly previousElementSibling: Element | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/after Element.after} on MDN
   */
  after(...nodes: Array<Node | string>): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/before Element.before} on MDN
   */
  before(...nodes: Array<Node | string>): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/remove Element.remove} on MDN
   */
  remove(): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceWith Element.replaceWith} on MDN
   */
  replaceWith(...nodes: Array<Node | string>): this;
}

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@linkcode ChildNode}.
 */
export declare const ChildNode: {
  /**
   * Extends the constructor prototype with properties and methods of the {@linkcode ChildNode}.
   */
  extend(constructor: new (...args: any[]) => any): void;
};

export interface ParentNode extends Node {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/children Element.children} on MDN
   */
  readonly children: readonly Node[];

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/childElementCount Element.childElementCount} on MDN
   */
  readonly childElementCount: number;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/firstElementChild Element.firstElementChild} on MDN
   */
  readonly firstElementChild: Element | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/lastElementChild Element.lastElementChild} on MDN
   */
  readonly lastElementChild: Element | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/append Element.append} on MDN
   */
  append(...nodes: Array<Node | string>): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend Element.prepend} on MDN
   */
  prepend(...nodes: Array<Node | string>): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren Element.replaceChildren} on MDN
   */
  replaceChildren(...nodes: Array<Node | string>): this;
}

/**
 * The mixin that can extend the constructor prototype with properties and methods of the {@linkcode ParentNode}.
 */
export declare const ParentNode: {
  /**
   * Extends the constructor prototype with properties and methods of the {@linkcode ParentNode}.
   */
  extend(constructor: new (...args: any[]) => any): void;
};

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList DOMTokenList} on MDN
 */
export declare class DOMTokenList {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length DOMTokenList.length} on MDN
   */
  readonly length: number;
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value DOMTokenList.value} on MDN
   */
  value: string;

  /**
   * Creates a new instance of {@linkcode DOMTokenList}.
   *
   * @param valueAccessor The accessor that reads and writes the class string to the element.
   */
  constructor(valueAccessor: ValueAccessor);

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add DOMTokenList.add} on MDN
   */
  add(...tokens: string[]): void;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains DOMTokenList.contains} on MDN
   */
  contains(token: string): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item DOMTokenList.item} on MDN
   */
  item(index: number): string | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove DOMTokenList.remove} on MDN
   */
  remove(...tokens: string[]): void;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace DOMTokenList.replace} on MDN
   */
  replace(replacedToken: string, token: string): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle DOMTokenList.toggle} on MDN
   */
  toggle(token: string, force?: boolean): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/forEach DOMTokenList.forEach} on MDN
   */
  forEach(callback: (value: string, index: number, parent: DOMTokenList) => void, thisArg?: any): void;
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element Element} on MDN
 */
export declare class Element extends Node implements ChildNode, ParentNode {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName Element.tagName} on MDN
   */
  readonly tagName: string;

  /**
   * Map from an attribute name to an attribute value. If an attribute is absent then value is `undefined`.
   */
  attrs: { [name: string]: string };

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/id Element.id} on MDN
   */
  id: string;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/className Element.className} on MDN
   */
  className: string;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/classList Element.classList} on MDN
   */
  readonly classList: DOMTokenList;
  readonly nextElementSibling: Element | null;
  readonly previousElementSibling: Element | null;
  readonly children: readonly Node[];
  readonly childElementCount: number;
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  /**
   * Creates a new instance of {@linkcode Element}.
   */
  constructor(tagName: string, attrs?: { [name: string]: string });

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute Element.setAttribute} on MDN
   */
  setAttribute(name: string, value: string): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute Element.getAttribute} on MDN
   */
  getAttribute(name: string): string | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute Element.hasAttribute} on MDN
   */
  hasAttribute(name: string): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute Element.removeAttribute} on MDN
   */
  removeAttribute(name: string): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute Element.toggleAttribute} on MDN
   */
  toggleAttribute(name: string, force?: boolean): boolean;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames Element.getAttributeNames} on MDN
   */
  getAttributeNames(): string[];

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement Element.insertAdjacentElement} on MDN
   */
  insertAdjacentElement(position: InsertPosition, element: Element): Element | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText Element.insertAdjacentText} on MDN
   */
  insertAdjacentText(position: InsertPosition, data: string): void;

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData CharacterData} on MDN
 */
export declare abstract class CharacterData extends Node implements ChildNode {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/length CharacterData.length} on MDN
   */
  readonly length: number;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/data CharacterData.data} on MDN
   */
  data: string;
  readonly nextElementSibling: Element | null;
  readonly previousElementSibling: Element | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/appendData CharacterData.appendData} on MDN
   */
  appendData(data: string): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/deleteData CharacterData.deleteData} on MDN
   */
  deleteData(offset: number, count: number): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/insertData CharacterData.insertData} on MDN
   */
  insertData(offset: number, data: string): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/replaceData CharacterData.replaceData} on MDN
   */
  replaceData(offset: number, count: number, data: string): this;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/substringData CharacterData.substringData} on MDN
   */
  substringData(offset: number, count: number): string;

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Comment Comment} on MDN
 */
export declare class Comment extends CharacterData {
  /**
   * Creates a new instance of {@linkcode Comment}.
   */
  constructor(data?: string);
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction ProcessingInstruction} on MDN
 */
export declare class ProcessingInstruction extends CharacterData {
  readonly target: string;

  /**
   * Creates a new instance of {@linkcode ProcessingInstruction}.
   */
  constructor(target: string, data?: string);
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Text Text} on MDN
 */
export declare class Text extends CharacterData {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Text/wholeText Text.wholeText} on MDN
   */
  readonly wholeText: string;

  /**
   * Creates a new instance of {@linkcode Text}.
   */
  constructor(data?: string);

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText Text.splitText} on MDN
   */
  splitText(offset: number): this;
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/CDATASection CDATASection} on MDN
 */
export declare class CDATASection extends Text {
  /**
   * Creates a new instance of {@linkcode CDATASection}.
   */
  constructor(data?: string);
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType} on MDN
 */
export declare class DocumentType extends Node implements ChildNode {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType.name} on MDN
   */
  readonly name: string;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType.publicId} on MDN
   */
  readonly publicId: string;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType.systemId} on MDN
   */
  readonly systemId: string;
  readonly nextElementSibling: Element | null;
  readonly previousElementSibling: Element | null;

  /**
   * Creates a new instance of {@linkcode DocumentType}.
   */
  constructor(name: string, publicId?: string, systemId?: string);

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment DocumentFragment} on MDN
 */
export declare class DocumentFragment extends Node implements ParentNode {
  readonly children: readonly Node[];
  readonly childElementCount: number;
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Document Document} on MDN
 */
export declare class Document extends Node implements ParentNode {
  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Document/doctype Document.doctype} on MDN
   */
  readonly doctype: DocumentType | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement Document.documentElement} on MDN
   */
  readonly documentElement: Element | null;
  readonly children: readonly Node[];
  readonly childElementCount: number;
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}

/**
 * See {@linkcode https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter NodeFilter} on W3C
 */
export type NodeFilter = ((node: Node) => number) | { acceptNode(node: Node): number };

/**
 * See {@linkcode https://www.w3.org/TR/DOM-Level-2-Traversal-Range/traversal.html#Traversal-NodeFilter NodeFilter} on W3C
 */
export declare const NodeFilter: {
  FILTER_ACCEPT: number;
  FILTER_REJECT: number;
  FILTER_SKIP: number;
  SHOW_ALL: number;
  SHOW_ATTRIBUTE: number;
  SHOW_CDATA_SECTION: number;
  SHOW_COMMENT: number;
  SHOW_DOCUMENT: number;
  SHOW_DOCUMENT_FRAGMENT: number;
  SHOW_DOCUMENT_TYPE: number;
  SHOW_ELEMENT: number;
  SHOW_PROCESSING_INSTRUCTION: number;
  SHOW_TEXT: number;
};

/**
 * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker TreeWalker} on MDN
 */
export declare class TreeWalker {
  /**
   * Creates a new {@linkcode TreeWalker} instance.
   *
   * @param root A root {@linkcode Node} of this {@linkcode TreeWalker} traversal.
   * @param whatToShow A unsigned long representing a bitmask created by combining the constant properties of
   * {@linkcode NodeFilter}.
   * @param filter A {@linkcode NodeFilter}, that is an object with a method `acceptNode`, which is called by the
   * {@linkcode TreeWalker} to determine whether to accept a node that has passed the `whatToShow` check.
   */
  constructor(root: Node, whatToShow?: number, filter?: NodeFilter | null);

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/currentNode TreeWalker.currentNode} on MDN
   */
  currentNode: Node;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/filter TreeWalker.filter} on MDN
   */
  readonly filter: NodeFilter | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/root TreeWalker.root} on MDN
   */
  readonly root: Node;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/whatToShow TreeWalker.whatToShow} on MDN
   */
  readonly whatToShow: number;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/parentNode TreeWalker.parentNode} on MDN
   */
  parentNode(): Node | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/firstChild TreeWalker.firstChild} on MDN
   */
  firstChild(): Node | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/lastChild TreeWalker.lastChild} on MDN
   */
  lastChild(): Node | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/nextNode TreeWalker.nextNode} on MDN
   */
  nextNode(): Node | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/previousNode TreeWalker.previousNode} on MDN
   */
  previousNode(): Node | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/nextSibling TreeWalker.nextSibling} on MDN
   */
  nextSibling(): Node | null;

  /**
   * See {@linkcode https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker/previousSibling TreeWalker.previousSibling} on MDN
   */
  previousSibling(): Node | null;
}
