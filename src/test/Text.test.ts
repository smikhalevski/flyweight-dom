import { CharacterData, Node, Text } from '../main';

describe('Text', () => {
  test('creates a new Text instance', () => {
    const node = new Text();

    expect(node).toBeInstanceOf(Node);
    expect(node).toBeInstanceOf(CharacterData);
    expect(node).toBeInstanceOf(Text);
    expect(node.data).toBe('');
    expect(node.nodeValue).toBe('');
  });
});
