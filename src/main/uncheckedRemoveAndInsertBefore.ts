import type { ChildNode } from './ChildNode.ts';
import type { ParentNode } from './ParentNode.ts';
import { uncheckedInsertBefore as importedUncheckedInsertBefore } from './uncheckedInsertBefore.ts';
import { uncheckedRemoveChild as importedUncheckedRemoveChild } from './uncheckedRemoveChild.ts';
import type { InsertableNode } from './uncheckedToInsertableNode.ts';
import { isDocumentFragment as importedIsDocumentFragment } from './utils.ts';

// V8 checks an imported function at every call, but inlines a local constant without a check
const uncheckedInsertBefore = importedUncheckedInsertBefore;
const uncheckedRemoveChild = importedUncheckedRemoveChild;
const isDocumentFragment = importedIsDocumentFragment;

export const uncheckedRemoveAndInsertBefore = (
  parent: ParentNode,
  node: InsertableNode,
  referenceChild: ChildNode
): void => {
  if (isDocumentFragment(node)) {
    node['_notifyChildrenChanged']();

    let fragmentChild = node.firstChild;

    while (fragmentChild !== null) {
      const { nextSibling } = fragmentChild;

      uncheckedInsertBefore(parent, fragmentChild, referenceChild);
      fragmentChild = nextSibling;
    }

    node.firstChild = node.lastChild = null;
    return;
  }

  const { parentNode } = node;

  if (parentNode !== null) {
    uncheckedRemoveChild(parentNode, node);
  }

  uncheckedInsertBefore(parent, node, referenceChild);
};
