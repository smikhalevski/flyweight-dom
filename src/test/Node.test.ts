import { Node } from '../main/Node';
import { Text } from '../main/Text';

describe('Node', () => {
  test('creates a new Node instance', () => {
    const node = new Node(0, '#node');

    expect(node).toBeInstanceOf(Node);
    expect(node.childNodes).toEqual([]);
    expect(node.parentNode).toBe(null);
    expect(node.parentElement).toBe(null);
    expect(node.previousSibling).toBe(null);
    expect(node.nextSibling).toBe(null);
    expect(node.firstChild).toBe(null);
    expect(node.lastChild).toBe(null);
    expect(node.nodeType).toBe(0);
    expect(node.nodeName).toBe('#node');
  });

  test('populates childNodes', () => {
    const node = new Node(0, '#node');

    expect(node.childNodes).toEqual([]);
  });

  test('hasChildNodes return false', () => {
    const node = new Node(0, '#node');

    expect(node.hasChildNodes()).toBe(false);
  });

  test('child mutation methods throw', () => {
    const node = new Node(0, '#node');

    const text = new Text();

    expect(() => node.appendChild(text)).toThrow(new Error('This node type does not support this method'));
    expect(() => node.insertBefore(text, null)).toThrow(new Error('This node type does not support this method'));
    expect(() => node.removeChild(text)).toThrow(new Error('This node type does not support this method'));
    expect(() => node.replaceChild(text, text)).toThrow(new Error('This node type does not support this method'));
  });

  test('cloneNode throws', () => {
    const node = new Node(0, '#node');

    expect(() => node.cloneNode()).toThrow(new Error('Abstract method'));
  });
});
