import type { Document } from './Document.ts';
import type { Element } from './Element.ts';
import type { Node } from './Node.ts';
import { DOCUMENT_NODE, isElement, XML_NAMESPACE, XMLNS_NAMESPACE } from './utils.ts';

/**
 * Returns the namespace that the prefix is bound to at the given node, or `null` if the prefix isn't bound.
 *
 * The lookup goes up from the node, and at each element it reads the namespace and the prefix of the element first,
 * and then its `xmlns` attributes. So a prefix resolves both in a parsed tree, where prefixes are declared by
 * attributes, and in a tree that was built from elements with namespaces and has no `xmlns` attributes yet.
 *
 * @param node The node where the lookup starts.
 * @param prefix The prefix to look up, or `null` to look up the default namespace.
 * @see [Node.lookupNamespaceURI](https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupNamespaceURI) on MDN
 * @group Other
 */
export function lookupNamespaceURI(node: Node, prefix: string | null | undefined): string | null {
  if (prefix === undefined || prefix === '') {
    prefix = null;
  }

  if (prefix === 'xml') {
    return XML_NAMESPACE;
  }

  if (prefix === 'xmlns') {
    return XMLNS_NAMESPACE;
  }

  const attributeName = prefix === null ? 'xmlns' : 'xmlns:' + prefix;

  for (let element = getNamespaceScope(node); element !== null; element = element.parentElement) {
    if (element.namespaceURI !== null && hasPrefix(element.tagName, prefix)) {
      return element.namespaceURI;
    }

    const value = element.getAttribute(attributeName);

    if (value !== null) {
      // An empty xmlns attribute removes the default namespace
      return value.length === 0 ? null : value;
    }
  }

  return null;
}

/**
 * Returns the closest element whose namespace declarations are in scope at the node.
 */
export function getNamespaceScope(node: Node): Element | null {
  if (isElement(node)) {
    return node;
  }
  if (node.nodeType === DOCUMENT_NODE) {
    return (node as Document).documentElement;
  }
  return node.parentElement;
}

/**
 * Returns `true` if the qualified name has the given prefix.
 */
function hasPrefix(qualifiedName: string, prefix: string | null): boolean {
  const index = qualifiedName.indexOf(':');

  return prefix === null ? index === -1 : index === prefix.length && qualifiedName.startsWith(prefix);
}
