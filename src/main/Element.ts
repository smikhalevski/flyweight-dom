import { ChildNode } from './ChildNode.ts';
import { DOMTokenList, type ValueAccessor } from './DOMTokenList.ts';
import { getElementsByClassName } from './getElementsByClassName.ts';
import { getElementsByTagName } from './getElementsByTagName.ts';
import { getElementsByTagNameNS } from './getElementsByTagNameNS.ts';
import { lookupNamespaceURI } from './lookupNamespaceURI.ts';
import type { Node } from './Node.ts';
import { ParentNode } from './ParentNode.ts';
import { getTextContent, setTextContent, Text } from './Text.ts';
import { uncheckedCloneChildren } from './uncheckedCloneChildren.ts';
import {
  coerceToString,
  defineNodeType,
  ELEMENT_NODE,
  hasOwnProperty,
  isEqualChildNodes,
  isEqualConstructor,
  XMLNS_NAMESPACE,
} from './utils.ts';

/**
 * The position is case-insensitive.
 *
 * @group Other
 */
export type InsertPosition =
  | 'beforebegin'
  | 'afterbegin'
  | 'beforeend'
  | 'afterend'
  | 'beforeBegin'
  | 'afterBegin'
  | 'beforeEnd'
  | 'afterEnd';

/**
 * @see [Element](https://developer.mozilla.org/en-US/docs/Web/API/Element) on MDN
 * @group Nodes
 */
export class Element extends ParentNode(ChildNode()) {
  /**
   * Backs {@link classList}. Initialized on construction, so creating the list later doesn't change the hidden class of
   * the element.
   */
  private _classList: DOMTokenList | undefined = undefined;

  /**
   * @see [Element.id](https://developer.mozilla.org/en-US/docs/Web/API/Element/id) on MDN
   */
  get id(): string {
    return this.attributes.id ?? '';
  }

  set id(value: string) {
    this.attributes.id = coerceToString(value);
  }

  /**
   * @see [Element.className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) on MDN
   */
  get className(): string {
    return this.attributes.class ?? '';
  }

  set className(value: string) {
    this.attributes.class = coerceToString(value);
  }

  /**
   * The part of the {@link tagName} before the colon, or `null` if the element has no namespace or no prefix.
   *
   * @see [Element.prefix](https://developer.mozilla.org/en-US/docs/Web/API/Element/prefix) on MDN
   */
  get prefix(): string | null {
    const index = this.namespaceURI === null ? -1 : this.tagName.indexOf(':');

    return index === -1 ? null : this.tagName.substring(0, index);
  }

  /**
   * The part of the {@link tagName} after the colon, or the whole {@link tagName} if the element has no namespace or
   * no prefix.
   *
   * @see [Element.localName](https://developer.mozilla.org/en-US/docs/Web/API/Element/localName) on MDN
   */
  get localName(): string {
    const index = this.namespaceURI === null ? -1 : this.tagName.indexOf(':');

    return index === -1 ? this.tagName : this.tagName.substring(index + 1);
  }

  /**
   * @see [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) on MDN
   */
  get classList(): DOMTokenList {
    if (this._classList === undefined) {
      this._classList = new DOMTokenList(new ClassAttributeAccessor(this));
    }
    return this._classList;
  }

  get textContent(): string | null {
    return getTextContent(this);
  }

  set textContent(value: string | null | undefined) {
    setTextContent(this, value);
  }

  /**
   * Creates a new instance of {@link Element}.
   *
   * @param tagName The tag name of the element.
   * @param attributes The attributes of the element. The object isn't copied, to avoid an allocation per element, so
   * the element owns it, and it must not be passed to other elements.
   * @param namespaceURI The namespace of the element. The element doesn't read it from `xmlns` attributes, since the
   * namespace of a DOM element doesn't change when the element is moved or its attributes are changed.
   */
  constructor(
    /**
     * @see [Element.tagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName) on MDN
     */
    readonly tagName: string,
    /**
     * @see [Element.attributes](https://developer.mozilla.org/en-US/docs/Web/API/Element/attributes) on MDN
     */
    readonly attributes: Record<string, string> = {},
    /**
     * @see [Element.namespaceURI](https://developer.mozilla.org/en-US/docs/Web/API/Element/namespaceURI) on MDN
     */
    readonly namespaceURI: string | null = null
  ) {
    super();
  }

  /**
   * @param name The name of the attribute.
   * @param value The value of the attribute. `null` and `undefined` become an empty string, and other values are
   * stringified.
   * @see [Element.setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) on MDN
   */
  setAttribute(name: string, value: string | null | undefined): this {
    value = coerceToString(value);

    if (name === '__proto__') {
      // Assignment would call the inherited __proto__ setter, which ignores strings, so define an own property instead
      Object.defineProperty(this.attributes, name, { value, writable: true, enumerable: true, configurable: true });
    } else {
      this.attributes[name] = value;
    }
    return this;
  }

  /**
   * @see [Element.getAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttribute) on MDN
   */
  getAttribute(name: string): string | null {
    // Own property check, so inherited Object.prototype members aren't reported as attributes
    return hasOwnProperty(this.attributes, name) ? this.attributes[name] : null;
  }

  /**
   * @see [Element.hasAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttribute) on MDN
   */
  hasAttribute(name: string): boolean {
    return hasOwnProperty(this.attributes, name);
  }

  /**
   * @see [Element.removeAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttribute) on MDN
   */
  removeAttribute(name: string): this {
    delete this.attributes[name];
    return this;
  }

  /**
   * @see [Element.toggleAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/toggleAttribute) on MDN
   */
  toggleAttribute(name: string, force?: boolean): boolean {
    const value = this.getAttribute(name);
    const isPresent = value !== null;

    if (!isPresent && (force === undefined || force)) {
      this.setAttribute(name, '');
      return true;
    }

    if (isPresent && (force === undefined || !force)) {
      this.removeAttribute(name);
      return false;
    }

    return isPresent;
  }

  /**
   * @see [Element.getAttributeNames](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNames) on MDN
   */
  getAttributeNames(): string[] {
    return Object.keys(this.attributes);
  }

  /**
   * Sets the attribute with the given namespace and local name.
   *
   * The namespace of an attribute isn't stored: it is the namespace that the attribute prefix is bound to. So if the
   * prefix of the qualified name isn't bound yet, it is declared on this element with an `xmlns:*` attribute.
   *
   * @param namespaceURI The namespace of the attribute.
   * @param qualifiedName The name of the attribute with an optional prefix.
   * @param value The value of the attribute.
   * @see [Element.setAttributeNS](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttributeNS) on MDN
   */
  setAttributeNS(
    namespaceURI: string | null | undefined,
    qualifiedName: string,
    value: string | null | undefined
  ): this {
    const index = qualifiedName.indexOf(':');
    const name = getAttributeNameNS(
      this,
      namespaceURI,
      index === -1 ? qualifiedName : qualifiedName.substring(index + 1)
    );

    if (name !== null) {
      // The attribute exists, maybe with another prefix that is kept
      return this.setAttribute(name, value);
    }

    if (namespaceURI === null || namespaceURI === undefined || namespaceURI === '') {
      if (index !== -1) {
        throw new Error(
          "The namespace URI provided ('" +
            namespaceURI +
            "') is not valid for the qualified name provided ('" +
            qualifiedName +
            "')"
        );
      }
      return this.setAttribute(qualifiedName, value);
    }

    if (index === -1) {
      if (namespaceURI !== XMLNS_NAMESPACE || qualifiedName !== 'xmlns') {
        throw new Error(
          "The namespace URI provided ('" +
            namespaceURI +
            "') is not valid for the qualified name provided ('" +
            qualifiedName +
            "')"
        );
      }
      return this.setAttribute(qualifiedName, value);
    }

    const prefix = qualifiedName.substring(0, index);
    const prefixNamespaceURI = lookupNamespaceURI(this, prefix);

    if (prefixNamespaceURI === null) {
      this.setAttribute('xmlns:' + prefix, namespaceURI);
    } else if (prefixNamespaceURI !== namespaceURI) {
      throw new Error("The prefix '" + prefix + "' is bound to a different namespace");
    }

    return this.setAttribute(qualifiedName, value);
  }

  /**
   * @see [Element.getAttributeNS](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNS) on MDN
   */
  getAttributeNS(namespaceURI: string | null | undefined, localName: string): string | null {
    const name = getAttributeNameNS(this, namespaceURI, localName);

    return name !== null ? this.attributes[name] : null;
  }

  /**
   * @see [Element.hasAttributeNS](https://developer.mozilla.org/en-US/docs/Web/API/Element/hasAttributeNS) on MDN
   */
  hasAttributeNS(namespaceURI: string | null | undefined, localName: string): boolean {
    return getAttributeNameNS(this, namespaceURI, localName) !== null;
  }

  /**
   * @see [Element.removeAttributeNS](https://developer.mozilla.org/en-US/docs/Web/API/Element/removeAttributeNS) on MDN
   */
  removeAttributeNS(namespaceURI: string | null | undefined, localName: string): this {
    const name = getAttributeNameNS(this, namespaceURI, localName);

    if (name !== null) {
      delete this.attributes[name];
    }
    return this;
  }

  /**
   * @see [Element.getElementsByClassName](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByClassName) on MDN
   */
  getElementsByClassName(className: string): Element[] {
    return getElementsByClassName(this, className);
  }

  /**
   * @see [Element.getElementsByTagName](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagName) on MDN
   */
  getElementsByTagName(tagName: string): Element[] {
    return getElementsByTagName(this, tagName);
  }

  /**
   * @see [Element.getElementsByTagNameNS](https://developer.mozilla.org/en-US/docs/Web/API/Element/getElementsByTagNameNS) on MDN
   */
  getElementsByTagNameNS(namespaceURI: string | null | undefined, localName: string): Element[] {
    return getElementsByTagNameNS(this, namespaceURI, localName);
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
    insertAdjacentNode(this, position, new Text(data));
  }

  isEqualNode(otherNode: Node | null | undefined): boolean {
    return (
      isEqualConstructor(this, otherNode) &&
      this.tagName === otherNode.tagName &&
      this.namespaceURI === otherNode.namespaceURI &&
      isEqualAttributes(this.attributes, otherNode.attributes) &&
      isEqualChildNodes(this, otherNode)
    );
  }

  cloneNode(deep?: boolean): Element {
    // The constructor doesn't copy attributes, so the clone would share them otherwise
    const node = new (this.constructor as typeof Element)(this.tagName, { ...this.attributes }, this.namespaceURI);

    if (deep) {
      uncheckedCloneChildren(this, node);
    }
    return node;
  }
}

defineNodeType(Element, ELEMENT_NODE, element => element.tagName);

/**
 * Reads and writes the class attribute for {@link Element.classList}. A class takes less memory than an object with
 * two closures that capture the element.
 */
class ClassAttributeAccessor implements ValueAccessor {
  private _element: Element;

  constructor(element: Element) {
    this._element = element;
  }

  get(): string | null {
    return this._element.getAttribute('class');
  }

  set(value: string): void {
    this._element.attributes.class = value;
  }
}

/**
 * Returns `true` if both objects have the same attributes. Both objects are enumerated the same way, so the result
 * doesn't depend on the order of arguments.
 */
function isEqualAttributes(attributes: Record<string, string>, otherAttributes: Record<string, string>): boolean {
  let count = 0;

  for (const name in attributes) {
    if (attributes[name] !== otherAttributes[name]) {
      return false;
    }
    ++count;
  }

  for (const _name in otherAttributes) {
    --count;
  }

  return count === 0;
}

/**
 * Returns the name of the attribute with the given namespace and local name, or `null` if the element has no such
 * attribute.
 *
 * Attributes are stored by qualified names, and their namespaces aren't stored. The namespace of an attribute is the
 * namespace that its prefix is bound to, and an attribute without a prefix has no namespace, since the default
 * namespace doesn't apply to attributes.
 */
function getAttributeNameNS(
  element: Element,
  namespaceURI: string | null | undefined,
  localName: string
): string | null {
  const { attributes } = element;

  if (namespaceURI === null || namespaceURI === undefined || namespaceURI === '') {
    if (localName === 'xmlns' || !hasOwnProperty(attributes, localName)) {
      return null;
    }

    const index = localName.indexOf(':');

    // A prefix that isn't bound is a part of the local name, the same as for elements
    return index === -1 || lookupNamespaceURI(element, localName.substring(0, index)) === null ? localName : null;
  }

  if (namespaceURI === XMLNS_NAMESPACE && localName === 'xmlns') {
    return hasOwnProperty(attributes, localName) ? localName : null;
  }

  for (const name in attributes) {
    const index = name.length - localName.length - 1;

    if (
      index > 0 &&
      name.indexOf(':') === index &&
      name.endsWith(localName) &&
      lookupNamespaceURI(element, name.substring(0, index)) === namespaceURI
    ) {
      return name;
    }
  }

  return null;
}

function insertAdjacentNode<T extends Node>(element: Element, position: InsertPosition, node: T): T | null {
  switch (position.toLowerCase()) {
    case 'beforebegin':
      if (element.parentNode === null) {
        return null;
      }
      element.before(node);
      break;

    case 'afterbegin':
      element.prepend(node);
      break;

    case 'beforeend':
      element.append(node);
      break;

    case 'afterend':
      if (element.parentNode === null) {
        return null;
      }
      element.after(node);
      break;

    default:
      throw new Error(
        "The value provided ('" + position + "') is not one of 'beforeBegin', 'afterBegin', 'beforeEnd', or 'afterEnd'"
      );
  }

  return node;
}
