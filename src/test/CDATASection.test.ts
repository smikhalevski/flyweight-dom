import { CDATASection, CharacterData, Node, Text } from '../main';

describe('CDATASection', () => {
  test('inherits statics from Node', () => {
    expect(CDATASection.ELEMENT_NODE).toBe(1);
  });

  test('can extend the constructor', () => {
    class MyClass {}

    CDATASection.extend(MyClass);

    expect(new MyClass()).toBeInstanceOf(CDATASection);
  });

  test('creates a new CDATASection instance', () => {
    const node = new CDATASection();

    expect(node).toBeInstanceOf(Node);
    expect(node).toBeInstanceOf(CharacterData);
    expect(node).toBeInstanceOf(Text);
    expect(node).toBeInstanceOf(CDATASection);
    expect(node.nodeType).toBe(Node.CDATA_SECTION_NODE);
    expect(node.nodeName).toBe('#cdata-section');
    expect(node.length).toBe(0);
    expect(node.data).toBe('');
  });

  test('creates a new CDATASection instance with data', () => {
    const node = new CDATASection('aaa');

    expect(node.length).toBe(3);
    expect(node.data).toBe('aaa');
  });

  test('clones a CDATASection instance', () => {
    const node = new CDATASection('aaa').cloneNode() as CDATASection;

    expect(node).toBeInstanceOf(CDATASection);
    expect(node.data).toBe('aaa');
  });

  test('splits a CDATASection', () => {
    const node1 = new CDATASection('aaabbb');
    const node2 = node1.splitText(3);

    expect(node1.data).toBe('aaa');

    expect(node2).toBeInstanceOf(CDATASection);
    expect(node2.data).toBe('bbb');
  });

  test('clones a CDATASection instance', () => {
    const node = new CDATASection('aaa').cloneNode() as CDATASection;

    expect(node).toBeInstanceOf(CDATASection);
    expect(node.data).toBe('aaa');
  });
});
