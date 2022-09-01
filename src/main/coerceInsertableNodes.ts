import { DocumentFragment } from './DocumentFragment';
import { ChildNode } from './extendChildNode';
import { Node } from './Node';
import { ParentNode } from './extendParentNode';
import { NodeType } from './NodeType';
import { die } from './utils';
import { uncheckedContains } from './uncheckedContains';
import { Text } from './Text';

export type NodeLike = Node | string;

export type InsertableNode = DocumentFragment | ChildNode;

export function assertInsertableNode(parent: ParentNode, node: Node): asserts node is InsertableNode {
  const { nodeType } = node;

  if (nodeType === NodeType.DOCUMENT_NODE || nodeType === NodeType.ATTRIBUTE_NODE) {
    die('Insertable node expected');
  }
  if (nodeType === NodeType.ELEMENT_NODE && uncheckedContains(parent, node)) {
    die('The new child element contains the parent');
  }
}

export function coerceInsertableNodes(parent: ParentNode, nodes: NodeLike[]): asserts nodes is InsertableNode[] {
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i];

    if (typeof node !== 'string') {
      assertInsertableNode(parent, node);
    } else {
      nodes[i] = new Text(node);
    }
  }
}
