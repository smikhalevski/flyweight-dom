import { Mutable } from './node-utils';

export interface NonDocumentTypeChildNode {
  readonly nextElementSibling: Element | null;
  readonly previousElementSibling: Element | null;
}

export function constructNonDocumentTypeChildNode(node: Mutable<NonDocumentTypeChildNode>): void {
  node.nextElementSibling = node.previousElementSibling = null;
}
