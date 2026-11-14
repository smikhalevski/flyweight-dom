import type { ParentNode } from './ParentNode.ts';
import { uncheckedAppendChild as importedUncheckedAppendChild } from './uncheckedAppendChild.ts';
import { uncheckedRemoveChild as importedUncheckedRemoveChild } from './uncheckedRemoveChild.ts';
import type { InsertableNode } from './uncheckedToInsertableNode.ts';
import { isDocumentFragment as importedIsDocumentFragment } from './utils.ts';

// V8 checks an imported function at every call, but inlines a local constant without a check
const uncheckedAppendChild = importedUncheckedAppendChild;
const uncheckedRemoveChild = importedUncheckedRemoveChild;
const isDocumentFragment = importedIsDocumentFragment;

export const uncheckedRemoveAndAppendChild = (parent: ParentNode, node: InsertableNode): void => {
  if (isDocumentFragment(node)) {
    node['_notifyChildrenChanged']();

    let fragmentChild = node.firstChild;

    while (fragmentChild !== null) {
      const { nextSibling } = fragmentChild;

      uncheckedAppendChild(parent, fragmentChild);
      fragmentChild = nextSibling;
    }

    node.firstChild = node.lastChild = null;
    return;
  }

  const { parentNode } = node;

  if (parentNode !== null) {
    uncheckedRemoveChild(parentNode, node);
  }

  uncheckedAppendChild(parent, node);
};
