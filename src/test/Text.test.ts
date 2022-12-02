import { CharacterData, Node, Text } from '../main';

describe('Text', () => {
  test('creates a new Text instance', () => {
    const node = new Text();

    expect(node).toBeInstanceOf(Node);
    expect(node).toBeInstanceOf(CharacterData);
    expect(node).toBeInstanceOf(Text);
    expect(node.nodeType).toBe(Node.TEXT_NODE);
    expect(node.nodeName).toBe('#text');
    expect(node.length).toBe(0);
    expect(node.data).toBe('');
  });

  test('creates a new Text instance with data', () => {
    const node = new Text('aaa');

    expect(node.length).toBe(3);
    expect(node.data).toBe('aaa');
  });

  test('clones a Text instance', () => {
    const node = new Text('aaa').cloneNode() as Text;

    expect(node).toBeInstanceOf(Text);
    expect(node.data).toBe('aaa');
  });

  test('splits a Text', () => {
    const node1 = new Text('aaabbb');
    const node2 = node1.splitText(3);

    expect(node1.data).toBe('aaa');

    expect(node2).toBeInstanceOf(Text);
    expect(node2.data).toBe('bbb');
  });

  test('creates a new Text instance with data', () => {
    const node = new Text('aaa');

    expect(node.length).toBe(3);
  });

  test('data, nodeValue, and textContent are synchronized', () => {
    const node = new Text();

    node.data = 'aaa';

    expect(node.data).toBe('aaa');
    expect(node.nodeValue).toBe('aaa');
    expect(node.textContent).toBe('aaa');

    node.textContent = 'bbb';

    expect(node.data).toBe('bbb');
    expect(node.nodeValue).toBe('bbb');
    expect(node.textContent).toBe('bbb');

    node.textContent = null;

    expect(node.data).toBe('');
    expect(node.textContent).toBe('');

    node.nodeValue = 'bbb';

    expect(node.data).toBe('bbb');
    expect(node.nodeValue).toBe('bbb');
    expect(node.textContent).toBe('bbb');

    node.nodeValue = null;

    expect(node.data).toBe('');
    expect(node.nodeValue).toBe('');
    expect(node.textContent).toBe('');
  });

  test('clears the data', () => {
    const node = new Text('aaa');

    node.nodeValue = null;

    expect(node.data).toBe('');
  });
});
