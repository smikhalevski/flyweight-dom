import { die } from './utils';
import { Node } from './Node';
import { ChildNode } from './extendsChildNode';
import { NodeType } from './NodeType';
import { ParentNode } from './extendsParentNode';
import { Element } from './Element';
import { NonDocumentTypeChildNode } from './NonDocumentTypeChildNode';

export function assertNode(node: unknown): asserts node is Node {
  if (!node || typeof node !== 'object') {
    die('Node expected');
  }
}

export function assertChildNode(node: unknown): asserts node is ChildNode {
  assertNode(node);

  const { nodeType } = node;
  if (
    nodeType !== NodeType.ELEMENT_NODE &&
    nodeType !== NodeType.TEXT_NODE &&
    nodeType !== NodeType.CDATA_SECTION_NODE &&
    nodeType !== NodeType.PROCESSING_INSTRUCTION_NODE &&
    nodeType !== NodeType.COMMENT_NODE &&
    nodeType !== NodeType.DOCUMENT_TYPE_NODE
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

export function assertLegalInsertion(parent: ParentNode, node: Node, child: Node | null): void {
  const { nodeType } = node;

  if (
    parent.nodeType === NodeType.DOCUMENT_NODE &&
    nodeType !== NodeType.ELEMENT_NODE &&
    nodeType !== NodeType.COMMENT_NODE
  ) {
    die("Can't insert the node into the document");
  }

  child ||= parent.firstChild;

  if (!child) {
    return;
  }

  if (nodeType === NodeType.ELEMENT_NODE && child.nodeType === NodeType.DOCUMENT_TYPE_NODE) {
    die("Can't insert an element before a doctype");
  }
}

export function isNonDocumentTypeChildNode(node: Node): node is ChildNode & NonDocumentTypeChildNode {
  return node.nodeType !== NodeType.DOCUMENT_TYPE_NODE;
}

export function isElementNode(node: Node): node is Element {
  return node.nodeType === NodeType.ELEMENT_NODE;
}

export function uncheckedContains(parent: Node, node: Node | null): boolean {
  if (!parent.firstChild) {
    return false;
  }
  while (node) {
    if (parent === node) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

export function uncheckedRemove(child: ChildNode): void {
  const { parentNode, previousSibling, nextSibling } = child;

  if (!parentNode) {
    return;
  }

  const { _childNodes } = parentNode;

  if (_childNodes) {
    _childNodes.splice(_childNodes.indexOf(child), 1);
  }

  if (previousSibling) {
    previousSibling.nextSibling = nextSibling;
  } else {
    parentNode.firstChild = nextSibling;
  }

  if (nextSibling) {
    nextSibling.previousSibling = previousSibling;
  } else {
    parentNode.lastChild = previousSibling;
  }

  if (isElementNode(child)) {
    const { previousElementSibling, nextElementSibling } = child;

    const { _children } = parentNode;

    if (_children) {
      _children.splice(_children.indexOf(child), 1);
    }

    if (previousElementSibling) {
      previousElementSibling.nextElementSibling = nextElementSibling;
    } else {
      parentNode.firstElementChild = nextElementSibling;
    }

    if (nextElementSibling) {
      nextElementSibling.previousElementSibling = previousElementSibling;
    } else {
      parentNode.lastElementChild = previousElementSibling;
    }
  }

  if (isNonDocumentTypeChildNode(child)) {
    child.previousElementSibling = child.nextElementSibling = null;
  }

  child.parentNode =
    child.parentElement =
    child.previousSibling =
    child.nextSibling =
    child.previousSibling =
    child.nextSibling =
      null;
}

export function uncheckedInsertBefore(parent: ParentNode, node: ChildNode, child: ChildNode | null): void {
  const { firstChild, _childNodes, _children } = parent;

  child ||= firstChild;

  node.parentNode = parent;

  if (!child) {
    // There are no child nodes in the parent

    parent.firstChild = parent.lastChild = node;

    if (_childNodes) {
      _childNodes.push(node);
    }

    if (isElementNode(node)) {
      parent.firstElementChild = parent.lastElementChild = node;

      if (_children) {
        _children.push(node);
      }
    }
    return;
  }

  const { previousSibling } = child;

  child.previousSibling = node;
  node.nextSibling = child;

  if (previousSibling) {
    previousSibling.nextSibling = node;
    node.previousSibling = previousSibling;

    if (_childNodes) {
      _childNodes.splice(_childNodes.indexOf(child), 0, node);
    }
  } else {
    parent.firstChild = node;

    if (_childNodes) {
      _childNodes.unshift(node);
    }
  }

  if (!isElementNode(node)) {
    // The element sequence isn't affected
    return;
  }

  // Element cannot be inserted before the doctype

  const element = isElementNode(child) ? child : (child as NonDocumentTypeChildNode).nextElementSibling;

  if (element) {
    // Insert an element before another element

    const { previousElementSibling } = element;

    element.previousElementSibling = node;
    node.nextElementSibling = element;

    if (previousElementSibling) {
      previousElementSibling.nextElementSibling = node;
      node.previousElementSibling = previousElementSibling;

      if (_children) {
        _children.splice(_children.indexOf(element), 0, node);
      }
    } else {
      parent.firstElementChild = node;

      if (_children) {
        _children.unshift(node);
      }
    }
    return;
  }

  // There's no next element

  parent.lastElementChild = node;

  const { previousElementSibling } = child as NonDocumentTypeChildNode;

  if (previousElementSibling) {
    node.previousElementSibling = previousElementSibling;
    previousElementSibling.nextElementSibling = node;
  } else {
    parent.firstElementChild = node;
  }

  if (_children) {
    _children.push(node);
  }
}

export function uncheckedAppendChild(parent: ParentNode, node: ChildNode): void {
  const { lastChild, _childNodes } = parent;

  if (_childNodes) {
    _childNodes.push(node);
  }

  parent.lastChild = node;
  node.parentNode = parent;

  if (!lastChild) {
    parent.firstChild = node;

    if (isElementNode(node)) {
      parent.firstElementChild = parent.lastElementChild = node;
    }
    return;
  }

  lastChild.nextSibling = node;
  node.previousSibling = lastChild;

  if (!isElementNode(node)) {
    return;
  }

  const { lastElementChild, _children } = parent;

  if (_children) {
    _children.push(node);
  }

  parent.lastElementChild = node;

  if (lastElementChild) {
    lastElementChild.nextElementSibling = node;
    node.previousElementSibling = lastElementChild;
  } else {
    parent.firstElementChild = node;
  }
}

export function uncheckedCloneChildNodes(parent: ParentNode, node: ParentNode): void {
  for (let child = parent.firstChild; child; child = child.nextSibling) {
    uncheckedAppendChild(node, child.cloneNode(true) as ChildNode);
  }
}
