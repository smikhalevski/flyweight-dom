import { expect, test } from 'vitest';
import { f } from '../main/dsl.ts';
import { getElementsByName } from '../main/getElementsByName.ts';

test('returns elements with the given name', () => {
  const root = f.doc(f.xxx({ name: 'aaa' }, f.yyy(), f.zzz({ name: 'aaa' })));

  expect(getElementsByName(root, 'aaa')).toStrictEqual([root.childNodes[0], root.childNodes[0].childNodes[1]]);
});
