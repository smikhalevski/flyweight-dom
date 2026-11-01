import { expect, test } from 'vitest';
import { CharacterData, Node, ProcessingInstruction } from '../main/index.js';

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

test('clones an instance of a subclass', () => {
  class MockProcessingInstruction extends ProcessingInstruction {}

  expect(new MockProcessingInstruction('aaa').cloneNode()).toBeInstanceOf(MockProcessingInstruction);
});

test('processing instructions are equal if target and data are equal', () => {
  expect(new ProcessingInstruction('aaa', 'bbb').isEqualNode(new ProcessingInstruction('aaa', 'bbb'))).toBe(true);

  expect(new ProcessingInstruction('aaa', 'bbb').isEqualNode(new ProcessingInstruction('xxx', 'bbb'))).toBe(false);
  expect(new ProcessingInstruction('aaa', 'bbb').isEqualNode(new ProcessingInstruction('aaa', 'xxx'))).toBe(false);
});
