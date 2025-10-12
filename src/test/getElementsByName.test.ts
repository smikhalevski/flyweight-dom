import { expect, test } from 'vitest';
import { f } from '../main/dsl.js';
import { getElementsByName } from '../main/index.js';

test('returns elements with the given ID', () => {
  const root = f.doc(f.xxx({ name: 'aaa' }, f.yyy(), f.zzz({ name: 'aaa' })));

  expect(getElementsByName(root, 'aaa')).toStrictEqual([root.childNodes[0], root.childNodes[0].childNodes[1]]);
});
