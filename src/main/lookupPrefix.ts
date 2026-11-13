import { getNamespaceScope } from './lookupNamespaceURI.ts';
import type { Node } from './Node.ts';

/**
 * Returns a prefix that is bound to the namespace at the given node, or `null` if there's no such prefix.
 *
 * @param node The node where the lookup starts.
 * @param namespaceURI The namespace to look up.
 * @see [Node.lookupPrefix](https://developer.mozilla.org/en-US/docs/Web/API/Node/lookupPrefix) on MDN
 */
export function lookupPrefix(node: Node, namespaceURI: string | null | undefined): string | null {
  if (namespaceURI === null || namespaceURI === undefined || namespaceURI === '') {
    return null;
  }

  for (let element = getNamespaceScope(node); element !== null; element = element.parentElement) {
    if (element.namespaceURI === namespaceURI && element.prefix !== null) {
      return element.prefix;
    }

    const { attributes } = element;

    for (const name in attributes) {
      if (name.startsWith('xmlns:') && attributes[name] === namespaceURI) {
        return name.substring(6);
      }
    }
  }

  return null;
}
