import { die } from '../utils';
import { Node } from '../Node';
import { ChildNode } from '../constructChildNode';
import { NodeType } from '../NodeType';
import { Element } from '../Element';
import { DocumentFragment } from '../DocumentFragment';
import { uncheckedContains } from './uncheckedContains';
import { ParentNode } from '../constructParentNode';
import { Text } from '../Text';

export type NodeLike = Node | string;

export type InsertableNode = DocumentFragment | ChildNode;

export function assertChildNode(node: Node): asserts node is ChildNode {
  const { nodeType } = node;
  if (
    nodeType === NodeType.DOCUMENT_FRAGMENT_NODE ||
    nodeType === NodeType.ATTRIBUTE_NODE ||
    nodeType === NodeType.DOCUMENT_NODE
  ) {
    die('Child node expected');
  }
}

export function assertParent(parent: Node, child: Node, message: string): asserts child is ChildNode {
  if (child.parentNode !== parent) {
    die(message);
  }
}

export function assertInsertableNode(parent: ParentNode, node: Node): asserts node is InsertableNode {
  const { nodeType } = node;

  if (nodeType === NodeType.ATTRIBUTE_NODE || nodeType === NodeType.DOCUMENT_NODE) {
    die('Child node expected');
  }
  if (uncheckedContains(parent, node)) {
    die('The new child element contains the parent');
  }
}

export function coerceInsertableNodes(parent: ParentNode, nodes: NodeLike[]): asserts nodes is InsertableNode[] {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (typeof node === 'string') {
      nodes[i] = new Text(node);
    } else {
      assertInsertableNode(parent, node);
    }
  }
}

export function isElement(node: Node): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

export function isDocumentFragment(node: Node): node is DocumentFragment {
  return node.nodeType === NodeType.DOCUMENT_FRAGMENT_NODE;
}
