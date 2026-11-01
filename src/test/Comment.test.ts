import { expect, test } from 'vitest';
import { CharacterData, Comment, Node } from '../main/index.js';

test('creates an empty comment', () => {
  const node = new Comment();

  expect(node).toBeInstanceOf(Node);
  expect(node).toBeInstanceOf(CharacterData);
  expect(node).toBeInstanceOf(Comment);
  expect(node.nodeType).toBe(Node.COMMENT_NODE);
  expect(node.nodeName).toBe('#comment');
  expect(node.length).toBe(0);
  expect(node.data).toBe('');
});

test('creates a comment with data', () => {
  const node = new Comment('aaa');

  expect(node.length).toBe(3);
  expect(node.data).toBe('aaa');
});

test('clones a comment', () => {
  const node = new Comment('aaa').cloneNode() as Comment;

  expect(node).toBeInstanceOf(Comment);
  expect(node.data).toBe('aaa');
});
