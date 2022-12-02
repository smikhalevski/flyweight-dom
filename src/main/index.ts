export * from './CDATASection';
export * from './CharacterData';
export * from './Comment';
export * from './Document';
export * from './DocumentFragment';
export * from './DocumentType';
export * from './Element';
export * from './Node';
export * from './ProcessingInstruction';
export * from './Text';

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node on MDN}
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
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType Node.nodeType on MDN}
   */
  readonly nodeType: number;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName Node.nodeName on MDN}
   */
  readonly nodeName: string;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/parentNode Node.parentNode on MDN}
   */
  readonly parentNode: ParentNode | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/parentElement Node.parentElement on MDN}
   */
  readonly parentElement: Element | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/previousSibling Node.previousSibling on MDN}
   */
  readonly previousSibling: ChildNode | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nextSibling Node.nextSibling on MDN}
   */
  readonly nextSibling: ChildNode | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/firstChild Node.firstChild on MDN}
   */
  readonly firstChild: ChildNode | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/lastChild Node.lastChild on MDN}
   */
  readonly lastChild: ChildNode | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/childNodes Node.childNodes on MDN}
   */
  readonly childNodes: readonly ChildNode[];

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue Node.nodeValue on MDN}
   */
  nodeValue: string | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent Node.textContent on MDN}
   */
  textContent: string | null;

  /**
   * The index at which the node starts in the input stream.
   */
  startIndex: number;

  /**
   * The index at which the node ends in the input stream.
   */
  endIndex: number;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/hasChildNodes Node.hasChildNodes on MDN}
   */
  hasChildNodes(): boolean;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild Node.appendChild on MDN}
   */
  appendChild<T extends Node>(node: T): T;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/insertBefore Node.insertBefore on MDN}
   */
  insertBefore<T extends Node>(node: T, child: Node | null | undefined): T;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/contains Node.contains on MDN}
   */
  contains(node: Node | null | undefined): boolean;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild Node.removeChild on MDN}
   */
  removeChild<T extends Node>(child: T): T;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/replaceChild Node.replaceChild on MDN}
   */
  replaceChild<T extends Node>(node: Node, child: T): T;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode Node.cloneNode on MDN}
   */
  cloneNode(deep?: boolean): Node;
}

export interface ChildNode extends Node {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/nextElementSibling Element.nextElementSibling on MDN}
   */
  readonly nextElementSibling: Element | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/previousElementSibling Element.previousElementSibling on MDN}
   */
  readonly previousElementSibling: Element | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/after Element.after on MDN}
   */
  after(...nodes: Array<Node | string>): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/before Element.before on MDN}
   */
  before(...nodes: Array<Node | string>): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/remove Element.remove on MDN}
   */
  remove(): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceWith Element.replaceWith on MDN}
   */
  replaceWith(...nodes: Array<Node | string>): this;
}

export interface ParentNode extends Node {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/children Element.children on MDN}
   */
  readonly children: readonly Node[];

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/childElementCount Element.childElementCount on MDN}
   */
  readonly childElementCount: number;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/firstElementChild Element.firstElementChild on MDN}
   */
  readonly firstElementChild: Element | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/lastElementChild Element.lastElementChild on MDN}
   */
  readonly lastElementChild: Element | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/append Element.append on MDN}
   */
  append(...nodes: Array<Node | string>): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend Element.prepend on MDN}
   */
  prepend(...nodes: Array<Node | string>): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/replaceChildren Element.replaceChildren on MDN}
   */
  replaceChildren(...nodes: Array<Node | string>): this;
}

interface ValueAccessor {
  get(): string;

  set(value: string): void;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList DOMTokenList on MDN}
 */
export declare class DOMTokenList {
  protected constructor(valueAccessor: ValueAccessor);

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/length DOMTokenList.length on MDN}
   */
  readonly length: number;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/value DOMTokenList.value on MDN}
   */
  value: string;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add DOMTokenList.add on MDN}
   */
  add(...tokens: string[]): void;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains DOMTokenList.contains on MDN}
   */
  contains(token: string): boolean;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/item DOMTokenList.item on MDN}
   */
  item(index: number): string | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove DOMTokenList.remove on MDN}
   */
  remove(...tokens: string[]): void;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace DOMTokenList.replace on MDN}
   */
  replace(replacedToken: string, token: string): boolean;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle DOMTokenList.toggle on MDN}
   */
  toggle(token: string, force?: boolean): boolean;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/forEach DOMTokenList.forEach on MDN}
   */
  forEach(callback: (value: string, index: number, parent: DOMTokenList) => void, thisArg?: any): void;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element Element on MDN}
 */
export declare class Element extends Node implements ChildNode, ParentNode {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName Element.tagName on MDN}
   */
  readonly tagName: string;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id Element.id on MDN}
   */
  id: string;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/className Element.className on MDN}
   */
  className: string;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList Element.classList on MDN}
   */
  readonly classList: DOMTokenList;

  /**
   * Creates a new instance of {@link Element}.
   */
  constructor(tagName: string, attributes?: { [name: string]: string });

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute Element.setAttribute on MDN}
   */
  setAttribute(name: string, value: string): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute Element.getAttribute on MDN}
   */
  getAttribute(name: string): string | undefined;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute Element.hasAttribute on MDN}
   */
  hasAttribute(name: string): boolean;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute Element.removeAttribute on MDN}
   */
  removeAttribute(name: string): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames Element.getAttributeNames on MDN}
   */
  getAttributeNames(): string[];

  // Inherited from ChildNode

  readonly nextElementSibling: Element | null;
  readonly previousElementSibling: Element | null;

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;

  // Inherited from ParentNode

  readonly children: readonly Node[];
  readonly childElementCount: number;
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData CharacterData on MDN}
 */
export declare abstract class CharacterData extends Node implements ChildNode {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/length CharacterData.length on MDN}
   */
  readonly length: number;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/data CharacterData.data on MDN}
   */
  data: string;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/appendData CharacterData.appendData on MDN}
   */
  appendData(data: string): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/deleteData CharacterData.deleteData on MDN}
   */
  deleteData(offset: number, count: number): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/insertData CharacterData.insertData on MDN}
   */
  insertData(offset: number, data: string): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/replaceData CharacterData.replaceData on MDN}
   */
  replaceData(offset: number, count: number, data: string): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData/substringData CharacterData.substringData on MDN}
   */
  substringData(offset: number, count: number): string;

  // Inherited from ChildNode

  readonly nextElementSibling: Element | null;
  readonly previousElementSibling: Element | null;

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Comment Comment on MDN}
 */
export declare class Comment extends CharacterData {
  /**
   * Creates a new instance of {@link Comment}.
   */
  constructor(data?: string);
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/ProcessingInstruction ProcessingInstruction on MDN}
 */
export declare class ProcessingInstruction extends CharacterData {
  readonly target: string;

  /**
   * Creates a new instance of {@link ProcessingInstruction}.
   */
  constructor(target: string, data?: string);
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text Text on MDN}
 */
export declare class Text extends CharacterData {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text/wholeText Text.wholeText on MDN}
   */
  readonly wholeText: string;

  /**
   * Creates a new instance of {@link Text}.
   */
  constructor(data?: string);

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Text/splitText Text.splitText on MDN}
   */
  splitText(offset: number): this;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CDATASection CDATASection on MDN}
 */
export declare class CDATASection extends Text {
  /**
   * Creates a new instance of {@link CDATASection}.
   */
  constructor(data?: string);
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType on MDN}
 */
export declare class DocumentType extends Node implements ChildNode {
  readonly name: string;
  readonly publicId: string;
  readonly systemId: string;

  /**
   * Creates a new instance of {@link DocumentType}.
   */
  constructor(name: string, publicId?: string, systemId?: string);

  // Inherited from ChildNode

  readonly nextElementSibling: Element | null;
  readonly previousElementSibling: Element | null;

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment DocumentFragment on MDN}
 */
export declare class DocumentFragment extends Node implements ParentNode {
  // Inherited from ParentNode

  readonly children: readonly Node[];
  readonly childElementCount: number;
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document on MDN}
 */
export declare class Document extends Node implements ParentNode {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/doctype Document.doctype on MDN}
   */
  readonly doctype: DocumentType | null;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement Document.documentElement on MDN}
   */
  readonly documentElement: Element | null;

  // Inherited from ParentNode

  readonly children: readonly Node[];
  readonly childElementCount: number;
  readonly firstElementChild: Element | null;
  readonly lastElementChild: Element | null;

  append(...nodes: Array<Node | string>): this;

  prepend(...nodes: Array<Node | string>): this;

  replaceChildren(...nodes: Array<Node | string>): this;
}
