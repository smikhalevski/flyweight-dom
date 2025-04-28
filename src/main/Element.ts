import { Node } from './Node';
import { getTextContent, isEqualChildNodes, isEqualConstructor, isSpaceChar, setTextContent } from './utils';
import { ChildNode, extendChildNode } from './ChildNode';
import { extendParentNode, ParentNode } from './ParentNode';
import { uncheckedCloneChildren } from './uncheckedCloneChildren';
import { DOMTokenList } from './DOMTokenList';
import { Text } from './Text';

/**
 * @group Nodes
 */
export interface Attributes {
  [name: string]: string;
}

/**
 * @group Other
 */
export type InsertPosition = 'beforeBegin' | 'afterBegin' | 'beforeEnd' | 'afterEnd';

/**
 * @group Nodes
 */
export interface Element extends ChildNode, ParentNode {}

/**
 * @see [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) on MDN
 * @group Nodes
 */
export class Element extends Node {
  readonly nodeName: string;
  readonly nodeType: number = Node.ELEMENT_NODE;

  /**
   * @see [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName) on MDN
   */
  readonly tagName: string;

  private _attributes: Attributes | undefined;

  /**
   * @see [Element.id](https://developer.mozilla.org/en-US/docs/Web/API/Element/id) on MDN
   */
  get id(): string {
    return this.getAttribute('id') || '';
  }

  set id(value: string) {
    this.setAttribute('id', value);
  }

  /**
   * @see [Element.className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) on MDN
   */
  get className(): string {
    return this.getAttribute('class') || '';
  }

  set className(value: string) {
    this.setAttribute('class', value);
  }

  /**
   * @see [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) on MDN
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

  get textContent(): string | null {
    return getTextContent(this);
  }

  set textContent(value: string | null) {
    setTextContent(this, value);
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
   * @see [Element.setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) on MDN
   */
  setAttribute(name: string, value: string): this {
    if (this._attributes === undefined) {
      this._attributes = {};
    }
    this._attributes[name] = '' + value;
    return this;
  }

  /**
   * @see [Element.getAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute) on MDN
   */
  getAttribute(name: string): string | null {
    return this._attributes !== undefined && this._attributes[name] !== undefined ? this._attributes[name] : null;
  }

  /**
   * @see [Element.hasAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute) on MDN
   */
  hasAttribute(name: string): boolean {
    return this._attributes !== undefined && this._attributes[name] !== undefined;
  }

  /**
   * @see [Element.removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute) on MDN
   */
  removeAttribute(name: string): this {
    if (this._attributes !== undefined) {
      delete this._attributes[name];
    }
    return this;
  }

  /**
   * @see [Element.toggleAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute) on MDN
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
   * @see [Element.getAttributeNames](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames) on MDN
   */
  getAttributeNames(): string[] {
    return this._attributes !== undefined ? Object.keys(this._attributes) : [];
  }

  /**
   * @see [Element.insertAdjacentElement](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement) on MDN
   */
  insertAdjacentElement(position: InsertPosition, element: Element): Element | null {
    return insertAdjacentNode(this, position, element);
  }

  /**
   * @see [Element.insertAdjacentText](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentText) on MDN
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
  throw new Error(
    "The value provided ('" + position + "') is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'"
  );
}
