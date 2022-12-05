import { Text } from '../main/Text';
import { Element } from '../main/Element';

describe('extendNode', () => {
  describe('hasChildNodes', () => {
    test('returns true if has children', () => {
      const parent = new Element('aaa');
      const text = new Text('text');

      expect(parent.hasChildNodes()).toBe(false);

      parent.append(text);

      expect(parent.hasChildNodes()).toBe(true);
    });
  });

  describe('appendChild', () => {
    test('appends a child to parent', () => {
      const parent = new Element('aaa');
      const text = new Text('text');

      parent.appendChild(text);

      expect(text.parentNode).toBe(parent);
    });

    test('removes a child from its previous parent', () => {
      const parent1 = new Element('parent1');
      const parent2 = new Element('parent2');
      const text = new Text('text');

      parent1.appendChild(text);
      parent2.appendChild(text);

      expect(text.parentNode).toBe(parent2);
      expect(parent1.firstChild).toBe(null);
      expect(parent2.firstChild).toBe(text);
    });
  });

  describe('insertBefore', () => {
    test('inserts a node as the first child', () => {
      const parent = new Element('aaa');
      const text = new Text('text');

      parent.insertBefore(text, null);

      expect(text.parentNode).toBe(parent);
      expect(parent.firstChild).toBe(text);
      expect(parent.lastChild).toBe(text);
    });

    test('throws if parent does not contain a child', () => {
      const parent = new Element('aaa');
      const text1 = new Text('text1');
      const text2 = new Text('text2');

      expect(() => parent.insertBefore(text2, text1)).toThrow(
        new Error('The node before which the new node is to be inserted is not a child of this node')
      );
    });

    test('inserts a node before the first child', () => {
      const parent = new Element('aaa');
      const text1 = new Text('text1');
      const text2 = new Text('text2');

      parent.appendChild(text1);
      parent.insertBefore(text2, text1);

      expect(text2.parentNode).toBe(parent);
      expect(parent.firstChild).toBe(text2);
      expect(parent.lastChild).toBe(text1);
    });

    test('inserts a node as an interim child', () => {
      const parent = new Element('aaa');
      const text1 = new Text('text1');
      const text2 = new Text('text2');
      const text3 = new Text('text3');

      parent.appendChild(text1);
      parent.appendChild(text3);
      parent.insertBefore(text2, text3);

      expect(text2.parentNode).toBe(parent);
      expect(parent.childNodes[0]).toBe(text1);
      expect(parent.childNodes[1]).toBe(text2);
      expect(parent.childNodes[2]).toBe(text3);
      expect(parent.firstChild).toBe(text1);
      expect(parent.lastChild).toBe(text3);
    });
  });

  describe('removeChild', () => {
    test('removes a child', () => {
      const parent = new Element('aaa');
      const text = new Text('text');

      parent.appendChild(text);
      parent.removeChild(text);

      expect(text.parentNode).toBe(null);
      expect(parent.firstChild).toBe(null);
    });

    test('throws if parent does not contain a child', () => {
      const parent = new Element('aaa');
      const text = new Text('text');

      expect(() => parent.removeChild(text)).toThrow(new Error('The node to be removed is not a child of this node'));
    });
  });

  describe('replaceChild', () => {
    test('replaces a child with a node', () => {
      const parent = new Element('aaa');
      const text1 = new Text('text1');
      const text2 = new Text('text2');

      parent.appendChild(text1);
      parent.replaceChild(text2, text1);

      expect(text1.parentNode).toBe(null);
      expect(text2.parentNode).toBe(parent);
    });

    test('throws if parent does not contain a child', () => {
      const parent = new Element('aaa');
      const text1 = new Text('text1');
      const text2 = new Text('text2');

      expect(() => parent.replaceChild(text2, text1)).toThrow(
        new Error('The node to be replaced is not a child of this node')
      );
    });
  });
});
