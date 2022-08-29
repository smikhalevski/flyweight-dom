import { die } from '../utils';
import { Node } from '../Node';
import { ChildNode } from '../extendsChildNode';
import { NodeType } from '../NodeType';
import { Element } from '../Element';
import { DocumentFragment } from '../DocumentFragment';
import { uncheckedContains } from './uncheckedContains';

export function assertNode(node: any): asserts node is Node {
  if (!node || typeof node !== 'object' || typeof node.nodeType !== 'number') {
    die('Node expected');
  }
}

export function assertChildNode(node: any): asserts node is ChildNode {
  assertNode(node);

  const { nodeType } = node;
  if (
    nodeType === NodeType.DOCUMENT_FRAGMENT_NODE ||
    nodeType === NodeType.ATTRIBUTE_NODE ||
    nodeType === NodeType.DOCUMENT_NODE
  ) {
    die('Child node expected');
  }
}

export function assertNotContains(parent: Node, node: Node): void {
  if (uncheckedContains(parent, node)) {
    die('The new child element contains the parent');
  }
}

export function assertParent(parent: Node, child: Node, message: string): asserts child is ChildNode {
  if (child.parentNode !== parent) {
    die(message);
  }
}

export function isElement(node: Node): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE;
}
