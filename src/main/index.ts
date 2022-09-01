export * from './CDATASection';
export * from './CharacterData';
export * from './Comment';
export * from './Document';
export * from './DocumentFragment';
export * from './DocumentType';
export * from './Element';
export * from './Node';
export * from './NodeType';
export * from './ProcessingInstruction';
export * from './Text';

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node Node on MDN}
 */
export declare abstract class Node {
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
  insertBefore<T extends Node>(node: T, child: Node | null): T;

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

  after(...nodes: Array<Node | string>): this;

  before(...nodes: Array<Node | string>): this;

  remove(): this;

  replaceWith(...nodes: Array<Node | string>): this;
}

export interface ParentNode extends Node {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/children Element.children on MDN}
   */
  readonly children: Node[];

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

export interface Element extends ChildNode, ParentNode {}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element Element on MDN}
 */
export declare class Element extends Node {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName Element.tagName on MDN}
   */
  readonly tagName: string;

  /**
   * Mapping from the attribute name to its value.
   */
  readonly attrs: { [name: string]: string };

  /**
   * Creates a new instance of {@link Element}.
   */
  constructor(tagName: string, attrs?: { [name: string]: string } | null);

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute Element.setAttribute on MDN}
   */
  setAttribute(name: string, value: string): this;

  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute Element.getAttribute on MDN}
   */
  getAttribute(name: string): string | null;

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
}

export interface CharacterData extends ChildNode {}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/CharacterData CharacterData on MDN}
 */
export declare abstract class CharacterData extends Node {
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

export interface DocumentType extends ChildNode {}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentType DocumentType on MDN}
 */
export declare class DocumentType extends Node {
  readonly name: string;
  readonly publicId: string;
  readonly systemId: string;

  /**
   * Creates a new instance of {@link DocumentType}.
   */
  constructor(name: string, publicId?: string, systemId?: string);
}

export interface DocumentFragment extends ParentNode {}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment DocumentFragment on MDN}
 */
export declare class DocumentFragment extends Node {}

export interface Document extends ParentNode {}

/**
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document on MDN}
 */
export declare class Document extends Node {
  /**
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/documentElement Document.documentElement on MDN}
   */
  readonly documentElement: Element | null;
}
