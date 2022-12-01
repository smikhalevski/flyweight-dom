import { CharacterData, Node, ProcessingInstruction } from '../main';

describe('ProcessingInstruction', () => {
  test('creates a new ProcessingInstruction instance', () => {
    const node = new ProcessingInstruction('xml');

    expect(node).toBeInstanceOf(Node);
    expect(node).toBeInstanceOf(CharacterData);
    expect(node).toBeInstanceOf(ProcessingInstruction);
    expect(node.nodeType).toBe(Node.PROCESSING_INSTRUCTION_NODE);
    expect(node.nodeName).toBe('xml');
    expect(node.length).toBe(0);
    expect(node.data).toBe('');
  });

  test('clones a ProcessingInstruction instance', () => {
    const node = new ProcessingInstruction('xml', 'aaa').cloneNode() as ProcessingInstruction;

    expect(node).toBeInstanceOf(ProcessingInstruction);
    expect(node.target).toBe('xml');
    expect(node.data).toBe('aaa');
  });
});
