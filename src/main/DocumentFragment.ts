import { Node } from './Node';
import { extendsParentNode, ParentNode } from './extendsParentNode';
import { NodeType } from './NodeType';
import { extendsClass } from './utils';
import { uncheckedCloneContents } from './unchecked';

/**
 * @internal
 */
export interface DocumentFragment extends Node, ParentNode {}

/**
 * @internal
 */
export class DocumentFragment {
  constructor() {
    Node.call(this, NodeType.DOCUMENT_FRAGMENT_NODE, '#document-fragment');
  }
}

const prototype = extendsClass(DocumentFragment, Node);

extendsParentNode(prototype);

prototype.cloneNode = function (deep) {
  const node = new DocumentFragment();
  if (deep) {
    uncheckedCloneContents(this, node);
  }
  return node;
};
