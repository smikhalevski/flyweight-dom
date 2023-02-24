import { Document, Element, NodeFilter, Text, TreeWalker } from '../main';
import { filterNode } from '../main/TreeWalker';
import { NodeFilterConstants } from '../main/utils';

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

    test('returns null if current node is root', () => {
      expect(new TreeWalker(text1).parentNode()).toBe(null);
    });

    test('ignores skipped nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element2' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
      );

      treeWalker.currentNode = text1;

      expect(treeWalker.parentNode()).toBe(element1);
    });

    test('ignores rejected nodes', () => {
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
      expect(new TreeWalker(text1).firstChild()).toBe(null);
    });

    test('ignores skipped nodes', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
        ).firstChild()
      ).toBe(element2);
    });

    test('steps over skipped nodes', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName !== 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
        ).firstChild()
      ).toBe(element3);
    });

    test('steps over rejected nodes', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element1' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        ).firstChild()
      ).toBe(element3);
    });
  });

  describe('lastChild', () => {
    test('returns the last child', () => {
      expect(new TreeWalker(document).lastChild()).toBe(element4);
    });

    test('returns null if there are no children', () => {
      expect(new TreeWalker(text1).lastChild()).toBe(null);
    });

    test('ignores skipped nodes', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element3' || node.nodeName === 'element4'
            ? NodeFilter.FILTER_SKIP
            : NodeFilter.FILTER_ACCEPT
        ).lastChild()
      ).toBe(text2);
    });

    test('steps over skipped nodes', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName !== 'element2' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
        ).lastChild()
      ).toBe(element2);
    });

    test('steps over rejected nodes', () => {
      expect(
        new TreeWalker(document, undefined, node =>
          node.nodeName === 'element4' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
        ).lastChild()
      ).toBe(element3);
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

      expect(treeWalker.nextSibling()).toBe(null);
    });

    test('returns null the current element is the root', () => {
      expect(new TreeWalker(element1).nextSibling()).toBe(null);
    });

    test('ignores skipped ancestor', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element2;

      expect(treeWalker.nextSibling()).toBe(element3);
    });

    test('ignores skipped sibling', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element1;

      expect(treeWalker.nextSibling()).toBe(text2);
    });

    test('ignores skipped subtree', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element4' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element1;

      expect(treeWalker.nextSibling()).toBe(element4);
    });

    test('ignores rejected nodes', () => {
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

      expect(treeWalker.previousSibling()).toBe(null);
    });

    test('returns null the current element is the root', () => {
      expect(new TreeWalker(element3).previousSibling()).toBe(null);
    });

    test('ignores skipped ancestor', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = text2;

      expect(treeWalker.previousSibling()).toBe(element1);
    });

    test('ignores skipped sibling', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousSibling()).toBe(text2);
    });

    test('ignores skipped subtree', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousSibling()).toBe(element1);
    });

    test('ignores rejected nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousSibling()).toBe(element1);
    });
  });

  describe('nextNode', () => {
    test('returns the child node', () => {
      expect(new TreeWalker(document).nextNode()).toBe(element1);
    });

    test('returns null is there is no next node', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element4;

      expect(treeWalker.nextNode()).toBe(null);
    });

    test('ignores skipped child nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );

      expect(treeWalker.nextNode()).toBe(element2);
    });

    test('exits parent', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element1' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = text1;

      expect(treeWalker.nextNode()).toBe(element3);
    });

    test('does not leave the root node', () => {
      const treeWalker = new TreeWalker(element1);
      treeWalker.currentNode = text1;

      expect(treeWalker.nextNode()).toBe(null);
    });

    test('ignores rejected nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName !== 'element4' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = text1;

      expect(treeWalker.nextNode()).toBe(element4);
    });
  });

  describe('previousNode', () => {
    test('returns the child of the previous sibling', () => {
      const treeWalker = new TreeWalker(document);
      treeWalker.currentNode = element4;

      expect(treeWalker.previousNode()).toBe(text2);
    });

    test('returns null if current node is root', () => {
      expect(new TreeWalker(element3).previousNode()).toBe(null);
    });

    test('ignores skipped nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeValue === 'text2' ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousNode()).toBe(element3);
    });

    test('ignores rejected nodes', () => {
      const treeWalker = new TreeWalker(document, undefined, node =>
        node.nodeName === 'element3' ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
      );
      treeWalker.currentNode = element4;

      expect(treeWalker.previousNode()).toBe(text1);
    });
  });
});

describe('filterNode', () => {
  test('returns skip if not shown', () => {
    const treeWalker = new TreeWalker(document, NodeFilter.SHOW_DOCUMENT | NodeFilterConstants.SHOW_TEXT);

    expect(filterNode(treeWalker, element4)).toBe(NodeFilter.FILTER_SKIP);

    expect(filterNode(treeWalker, document)).toBe(NodeFilter.FILTER_ACCEPT);
    expect(filterNode(treeWalker, text1)).toBe(NodeFilter.FILTER_ACCEPT);
  });

  test('calls filter function', () => {
    const filterMock = jest.fn();

    filterNode(new TreeWalker(document, undefined, filterMock), element4);

    expect(filterMock).toHaveBeenCalledTimes(1);
    expect(filterMock).toHaveBeenNthCalledWith(1, element4);
  });

  test('calls acceptNode method', () => {
    const acceptNodeMock = jest.fn();

    filterNode(new TreeWalker(document, undefined, { acceptNode: acceptNodeMock }), element4);

    expect(acceptNodeMock).toHaveBeenCalledTimes(1);
    expect(acceptNodeMock).toHaveBeenNthCalledWith(1, element4);
  });

  test('return FILTER_ACCEPT is invalid value is returned from filter', () => {
    expect(filterNode(new TreeWalker(document, undefined, () => 111), element4)).toBe(NodeFilter.FILTER_ACCEPT);
  });
});
