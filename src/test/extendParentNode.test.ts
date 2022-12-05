import { Text } from '../main/Text';
import { Element } from '../main/Element';
import { Document } from '../main/Document';

describe('extendParentNode', () => {
  describe('children', () => {
    test('returns the array of child elements', () => {
      const parent = new Element('aaa');
      const child1 = new Text('child1');
      const child2 = new Element('child2');
      const child3 = new Element('child3');

      parent.append(child1, child2, child3);

      expect(parent.children.length).toBe(2);
      expect(parent.children[0]).toBe(child2);
      expect(parent.children[1]).toBe(child3);
    });

    test('returns the same array', () => {
      const element = new Element('aaa');

      expect(element.children).toBe(element.children);
    });
  });

  describe('childElementCount', () => {
    test('returns the number of child elements', () => {
      const parent = new Element('aaa');
      const child1 = new Text('child1');
      const child2 = new Element('child2');
      const child3 = new Element('child3');

      parent.append(child1, child2, child3);

      expect(parent.children.length).toBe(2);
      expect(parent.children[0]).toBe(child2);
      expect(parent.children[1]).toBe(child3);
    });

    test('returns the same array', () => {
      const element = new Element('aaa');

      expect(element.children).toBe(element.children);
    });
  });

  describe('firstElementChild', () => {
    test('returns the first child element', () => {
      const parent = new Element('aaa');
      const child1 = new Text('child1');
      const child2 = new Element('child2');
      const child3 = new Element('child3');

      parent.append(child1, child2, child3);

      expect(parent.firstElementChild).toBe(child2);
    });
  });

  describe('lastElementChild', () => {
    test('returns the last child element', () => {
      const parent = new Element('aaa');
      const child1 = new Text('child1');
      const child2 = new Element('child2');
      const child3 = new Element('child3');

      parent.append(child1, child2, child3);

      expect(parent.lastElementChild).toBe(child3);
    });
  });

  describe('append', () => {
    test('appends the child', () => {
      const parent = new Element('aaa');
      const child1 = new Text('child1');
      const child2 = new Text('child2');

      expect(parent.append(child1, child2)).toBe(parent);

      expect(parent.firstChild).toBe(child1);
      expect(parent.lastChild).toBe(child2);
      expect(parent.firstChild!.nextSibling).toBe(child2);
    });

    test('does not append nodes if any of them is not appendable', () => {
      const parent = new Element('aaa');
      const child1 = new Text('child1');
      const child2 = new Document();

      expect(() => parent.append(child1, child2)).toThrow(new Error('Node cannot be a child'));
      expect(parent.firstChild).toBe(null);
      expect(child1.parentNode).toBe(null);
      expect(child2.parentNode).toBe(null);
    });
  });

  describe('prepend', () => {
    test('inserts a node as the first child', () => {
      const parent = new Element('aaa');
      const text = new Text('text');

      expect(parent.prepend(text)).toBe(parent);

      expect(text.parentNode).toBe(parent);
      expect(parent.firstChild).toBe(text);
      expect(parent.lastChild).toBe(text);
    });

    test('inserts a node before the first child', () => {
      const parent = new Element('aaa');
      const text1 = new Text('text1');
      const text2 = new Text('text2');

      parent.appendChild(text1);
      parent.prepend(text2);

      expect(text2.parentNode).toBe(parent);
      expect(parent.firstChild).toBe(text2);
      expect(parent.lastChild).toBe(text1);
    });
  });

  describe('replaceChildren', () => {
    test('removes all children', () => {
      const parent = new Element('aaa');
      const child = new Element('bbb');

      parent.append(child);

      expect(parent.children.length).toBe(1);
      expect(parent.childNodes.length).toBe(1);

      expect(parent.replaceChildren()).toBe(parent);

      expect(child.parentNode).toBe(null);
      expect(parent.firstChild).toBe(null);
      expect(parent.lastChild).toBe(null);
      expect(parent.children.length).toBe(0);
      expect(parent.childNodes.length).toBe(0);
    });

    test('appends new child nodes', () => {
      const parent = new Element('aaa');
      const child1 = new Element('bbb');
      const child2 = new Element('ccc');

      parent.append(child1);
      parent.replaceChildren(child2);

      expect(child1.parentNode).toBe(null);
      expect(child2.parentNode).toBe(parent);
      expect(parent.firstChild).toBe(child2);
      expect(parent.lastChild).toBe(child2);
      expect(parent.children.length).toBe(1);
      expect(parent.childNodes.length).toBe(1);
    });
  });
});
