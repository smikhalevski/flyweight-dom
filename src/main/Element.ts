import { Node } from './Node';
import { die, isEqualChildNodes, isEqualConstructor, isSpaceChar } from './utils';
import { ChildNode, extendChildNode } from './ChildNode';
import { extendParentNode, ParentNode } from './ParentNode';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DOMTokenList } from './DOMTokenList';
import { Text } from './Text';

export interface Attributes {
  [name: string]: string;
}

export type InsertPosition = 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';

export interface Element extends ChildNode, ParentNode {}

/**
 * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element Element} on MDN
 */
export class Element extends Node {
  readonly nodeName: string;
  readonly nodeType: number = Node.ELEMENT_NODE;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName Element.tagName} on MDN
   */
  readonly tagName: string;

  private _attributes: Attributes | undefined;

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/id Element.id} on MDN
   */
  get id(): string {
    return this.getAttribute('id') || '';
  }

  set id(value: string) {
    this.setAttribute('id', value);
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/className Element.className} on MDN
   */
  get className(): string {
    return this.getAttribute('class') || '';
  }

  set className(value: string) {
    this.setAttribute('class', value);
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList Element.classList} on MDN
   */
  get classList(): DOMTokenList {
    const tokenList = new DOMTokenList({
      get: () => {
        return this.getAttribute('class') || '';
      },
      set: value => {
        this.setAttribute('class', value);
      },
    });

    Object.defineProperty(this, 'classList', { value: tokenList });

    return tokenList;
  }

  /**
   * Map from an attribute name to an attribute value. If an attribute is absent then value is `undefined`.
   */
  get attributes(): Attributes {
    return this._attributes === undefined ? (this._attributes = {}) : this._attributes;
  }

  set attributes(value: Attributes) {
    this._attributes = value;
  }

  /**
   * Creates a new instance of {@link Element}.
   */
  constructor(tagName: string, attributes?: Attributes) {
    super();
    this.nodeName = this.tagName = tagName;
    this._attributes = attributes;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute Element.setAttribute} on MDN
   */
  setAttribute(name: string, value: string): this {
    if (this._attributes === undefined) {
      this._attributes = {};
    }
    this._attributes[name] = '' + value;
    return this;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute Element.getAttribute} on MDN
   */
  getAttribute(name: string): string | null {
    return this._attributes !== undefined && this._attributes[name] !== undefined ? this._attributes[name] : null;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute Element.hasAttribute} on MDN
   */
  hasAttribute(name: string): boolean {
    return this._attributes !== undefined && this._attributes[name] !== undefined;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute Element.removeAttribute} on MDN
   */
  removeAttribute(name: string): this {
    if (this._attributes !== undefined) {
      delete this._attributes[name];
    }
    return this;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute Element.toggleAttribute} on MDN
   */
  toggleAttribute(name: string, force?: boolean): boolean {
    const value = this.getAttribute(name);
    const exists = value !== null;

    if (!exists && (force === undefined || force)) {
      this.setAttribute(name, '');
      return true;
    }

    if (exists && (force === undefined || !force)) {
      this.removeAttribute(name);
      return false;
    }

    return exists;
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames Element.getAttributeNames} on MDN
   */
  getAttributeNames(): string[] {
    return this._attributes !== undefined ? Object.keys(this._attributes) : [];
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement Element.insertAdjacentElement} on MDN
   */
  insertAdjacentElement(position: InsertPosition, element: Element): Element | null {
    return insertAdjacentNode(this, position, element);
  }

  /**
   * **See** {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText Element.insertAdjacentText} on MDN
   */
  insertAdjacentText(position: InsertPosition, data: string): void {
    for (let i = 0, dataLength = data.length; i < dataLength; ++i) {
      if (!isSpaceChar(data.charCodeAt(i))) {
        insertAdjacentNode(this, position, new Text(data));
        break;
      }
    }
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return (
      isEqualConstructor(this, otherNode) &&
      this.tagName === otherNode.tagName &&
      isEqualAttributes(this._attributes, otherNode._attributes) &&
      isEqualChildNodes(this, otherNode)
    );
  }

  cloneNode(deep?: boolean): Element {
    const node = new Element(this.tagName, Object.assign({}, this._attributes));
    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}

extendChildNode(Element);
extendParentNode(Element);

function isEqualAttributes(attrs: Attributes | undefined, otherAttrs: Attributes | undefined): boolean {
  if (attrs === undefined) {
    return otherAttrs === undefined || Object.keys(otherAttrs).length === 0;
  }
  if (otherAttrs === undefined) {
    return Object.keys(attrs).length === 0;
  }
  let attributeCount = 0;

  for (const key in attrs) {
    ++attributeCount;

    if (attrs[key] !== otherAttrs[key]) {
      return false;
    }
  }
  return Object.keys(otherAttrs).length === attributeCount;
}

function insertAdjacentNode<T extends Node>(element: Element, position: InsertPosition, node: T): T | null {
  if (position === 'beforeBegin') {
    if (element.parentNode === null) {
      return null;
    }
    element.before(node);
    return node;
  }
  if (position === 'afterBegin') {
    element.prepend(node);
    return node;
  }
  if (position === 'beforeEnd') {
    element.append(node);
    return node;
  }
  if (position === 'afterEnd') {
    if (element.parentNode === null) {
      return null;
    }
    element.after(node);
    return node;
  }
  die("The value provided ('" + position + "') is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'");
}
