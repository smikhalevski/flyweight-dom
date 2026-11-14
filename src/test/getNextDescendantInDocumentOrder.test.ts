import { expect, test } from 'vitest';
import { h } from '../main/dsl.ts';
import { getNextDescendantInDocumentOrder } from '../main/getNextDescendantInDocumentOrder.ts';
import type { Node } from '../main/index.ts';

function getDescendants(root: Node): Node[] {
  const nodes = [];

  for (let node = root.firstChild; node !== null; node = getNextDescendantInDocumentOrder(node, root)) {
    nodes.push(node);
  }
  return nodes;
}

test('visits descendants in document order', () => {
  const root = h('aaa', h('bbb', h('ccc', 'xxx')), 'yyy', h('ddd'));
  const bbbNode = root.childNodes[0];
  const cccNode = bbbNode.childNodes[0];

  expect(getDescendants(root)).toStrictEqual([
    bbbNode,
    cccNode,
    cccNode.childNodes[0],
    root.childNodes[1],
    root.childNodes[2],
  ]);
});

test('does not visit nodes outside of the root', () => {
  const root = h('bbb', h('ccc'));

  h('aaa', root, h('ddd'));

  expect(getDescendants(root)).toStrictEqual([root.firstChild]);
});

test('visits nothing if the root has no children', () => {
  expect(getDescendants(h('aaa'))).toStrictEqual([]);
});
