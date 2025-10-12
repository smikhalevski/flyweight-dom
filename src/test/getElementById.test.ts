import { expect, test } from 'vitest';
import { f } from '../main/dsl.js';
import { getElementById } from '../main/index.js';

test('returns the element with the given ID', () => {
  const root = f.doc(f.xxx(f.yyy(), f.zzz({ id: 'aaa' })));

  expect(getElementById(root, 'aaa')).toBe(root.childNodes[0].childNodes[1]);
});
