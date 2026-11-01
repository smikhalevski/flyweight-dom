import { describe, expect, test, vi } from 'vitest';
import { Document, Element, NodeFilter, Text, TreeWalker } from '../main/index.js';
import { filterNode } from '../main/TreeWalker.js';

/*
 * <document>
 *   <element1>
 *     <element2>
 *       #text1
 *     </element2>
 *   </element1>
 *   <element3>
 *     #text2
 *   </element3>
 *   <element4/>
 * </document>
 */

const document = new Document();
const element1 = new Element('element1');
const element2 = new Element('element2');
const element3 = new Element('element3');
const element4 = new Element('element4');
const text1 = new Text('text1');
const text2 = new Text('text2');

document.append(element1.append(element2.append(text1)), element3.append(text2), element4);

describe('TreeWalker', () => {
  describe('parentNode', () => {
    test('returns the parent node', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = text1;

      expect(treeWalker.parentNode()).toBe(element2);
    });

    test('returns null if the current node is the root', () => {
      expect(new TreeWalker(text1).parentNode()).toBeNull();
    });

    test('returns the closest ancestor if the parent is skipped', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element2' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
      );

      treeWalker.currentNode = text1;

      expect(treeWalker.parentNode()).toBe(element1);
    });

    test('returns the closest ancestor if the parent is rejected', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element2' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
      );

      treeWalker.currentNode = text1;

      expect(treeWalker.parentNode()).toBe(element1);
    });
  });

  describe('firstChild', () => {
    test('returns the first child', () => {
      expect(new TreeWalker(document).firstChild()).toBe(element1);
    });

    test('returns null if there are no children', () => {
      expect(new TreeWalker(text1).firstChild()).toBeNull();
    });

    test('descends into a skipped child', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
        ).firstChild()
      ).toBe(element2);
    });

    test('returns the first accepted node after skipped subtrees', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName !== 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
        ).firstChild()
      ).toBe(element3);
    });

    test('does not descend into a rejected child', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element1' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        ).firstChild()
      ).toBe(element3);
    });

    test('returns null if no descendant is accepted', () => {
      expect(new TreeWalker(document, undefined, () => NodeFilter.FILTER_SKIP).firstChild()).toBeNull();
    });
  });

  describe('lastChild', () => {
    test('returns the last child', () => {
      expect(new TreeWalker(document).lastChild()).toBe(element4);
    });

    test('returns null if there are no children', () => {
      expect(new TreeWalker(text1).lastChild()).toBeNull();
    });

    test('descends into a skipped child', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element3' || node.nodeName === 'element4'
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT
        ).lastChild()
      ).toBe(text2);
    });

    test('returns the last accepted node before skipped subtrees', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName !== 'element2' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
        ).lastChild()
      ).toBe(element2);
    });

    test('does not descend into a rejected child', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element4' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        ).lastChild()
      ).toBe(element3);
    });

    test('returns null if no descendant is accepted', () => {
      expect(new TreeWalker(document, undefined, () => NodeFilter.FILTER_SKIP).lastChild()).toBeNull();
    });
  });

  describe('nextSibling', () => {
    test('returns the next sibling', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element1;

      expect(treeWalker.nextSibling()).toBe(element3);
    });

    test('returns null if there is no next sibling', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element4;

      expect(treeWalker.nextSibling()).toBeNull();
    });

    test('returns null if the current node is the root', () => {
      expect(new TreeWalker(element1).nextSibling()).toBeNull();
    });

    test('continues after a skipped parent', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element2;

      expect(treeWalker.nextSibling()).toBe(element3);
    });

    test('descends into a skipped sibling', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element1;

      expect(treeWalker.nextSibling()).toBe(text2);
    });

    test('steps over a subtree without accepted nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element4' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element1;

      expect(treeWalker.nextSibling()).toBe(element4);
    });

    test('does not descend into a rejected sibling', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element1;

      expect(treeWalker.nextSibling()).toBe(element4);
    });
  });

  describe('previousSibling', () => {
    test('returns the previous sibling', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element4;

      expect(treeWalker.previousSibling()).toBe(element3);
    });

    test('returns null if there is no previous sibling', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element1;

      expect(treeWalker.previousSibling()).toBeNull();
    });

    test('returns null if the current node is the root', () => {
      expect(new TreeWalker(element3).previousSibling()).toBeNull();
    });

    test('continues before a skipped parent', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = text2;

      expect(treeWalker.previousSibling()).toBe(element1);
    });

    test('descends into a skipped sibling', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousSibling()).toBe(text2);
    });

    test('steps over a subtree without accepted nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousSibling()).toBe(element1);
    });

    test('does not descend into a rejected sibling', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousSibling()).toBe(element1);
    });
  });

  describe('nextNode', () => {
    test('returns the first child', () => {
      expect(new TreeWalker(document).nextNode()).toBe(element1);
    });

    test('returns null if there is no next node', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element4;

      expect(treeWalker.nextNode()).toBeNull();
    });

    test('descends into a skipped child', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );

      expect(treeWalker.nextNode()).toBe(element2);
    });

    test('continues after the last descendant of a parent', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = text1;

      expect(treeWalker.nextNode()).toBe(element3);
    });

    test('does not leave the root', () => {
      const treeWalker = new TreeWalker(element1);
      treeWalker.currentNode = text1;

      expect(treeWalker.nextNode()).toBeNull();
    });

    test('returns null if the current node was removed from the tree', () => {
      const element = new Element('aaa');
      const treeWalker = new TreeWalker(new Element('bbb').append(element));
      treeWalker.currentNode = element;

      element.remove();

      expect(treeWalker.nextNode()).toBeNull();
    });

    test('does not descend into rejected nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element4' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = text1;

      expect(treeWalker.nextNode()).toBe(element4);
    });
  });

  describe('previousNode', () => {
    test('returns the last descendant of the previous sibling', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element4;

      expect(treeWalker.previousNode()).toBe(text2);
    });

    test('returns null if the current node is the root', () => {
      expect(new TreeWalker(element3).previousNode()).toBeNull();
    });

    test('returns the previous sibling if its descendants are skipped', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeValue === 'text2' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousNode()).toBe(element3);
    });

    test('does not descend into a rejected previous sibling', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousNode()).toBe(text1);
    });

    test('returns an ancestor of a skipped parent', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element2' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = text1;

      expect(treeWalker.previousNode()).toBe(element1);
    });

    test('returns null if the current node is not inside the root', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = new Text();

      expect(treeWalker.previousNode()).toBeNull();
    });
  });
});

describe('filterNode', () => {
  test('returns FILTER_SKIP for node types that are not shown', () => {
    const treeWalker = new TreeWalker(document, NodeFilter.SHOW_DOCUMENT | NodeFilter.SHOW_TEXT);

    expect(filterNode(treeWalker, element4)).toBe(NodeFilter.FILTER_SKIP);

    expect(filterNode(treeWalker, document)).toBe(NodeFilter.FILTER_ACCEPT);
    expect(filterNode(treeWalker, text1)).toBe(NodeFilter.FILTER_ACCEPT);
  });

  test('calls a filter function with the node', () => {
    const filterMock = vi.fn();

    filterNode(new TreeWalker(document, undefined, filterMock), element4);

    expect(filterMock).toHaveBeenCalledTimes(1);
    expect(filterMock).toHaveBeenNthCalledWith(1, element4);
  });

  test('calls acceptNode of a filter object with the node', () => {
    const acceptNodeMock = vi.fn();

    filterNode(new TreeWalker(document, undefined, { acceptNode: acceptNodeMock }), element4);

    expect(acceptNodeMock).toHaveBeenCalledTimes(1);
    expect(acceptNodeMock).toHaveBeenNthCalledWith(1, element4);
  });

  test('returns FILTER_ACCEPT if filter returns true', () => {
    // @ts-expect-error Filters written in JavaScript can return booleans
    expect(filterNode(new TreeWalker(document, undefined, () => true), element4)).toBe(NodeFilter.FILTER_ACCEPT);
  });

  test('does not accept a node if filter returns false', () => {
    // @ts-expect-error Filters written in JavaScript can return booleans
    expect(filterNode(new TreeWalker(document, undefined, () => false), element4)).toBe(0);
  });
});
