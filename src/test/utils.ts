// @ts-expect-error Node types aren't installed
import { setImmediate } from 'node:timers/promises';
// @ts-expect-error Node types aren't installed
import { setFlagsFromString } from 'node:v8';
// @ts-expect-error Node types aren't installed
import { runInNewContext } from 'node:vm';
import type { Node } from '../main/index.js';

setFlagsFromString('--expose-gc');

// The flag applies only to contexts that are created after it is set
const gc: () => void = runInNewContext('gc');

/**
 * Runs a full garbage collection. Waits for the current job to end first, since objects that a WeakRef was created for
 * during the job aren't collected until it ends.
 */
export async function collectGarbage(): Promise<void> {
  await setImmediate();
  gc();
}

/**
 * Returns child nodes of the parent. Throws if sibling links are inconsistent, so a cyclic list fails a test instead
 * of hanging it.
 */
export function getChildNodes(parent: Node): Node[] {
  const childNodes: Node[] = [];

  let previousSibling = null;

  for (let child = parent.firstChild; child !== null; child = child.nextSibling) {
    if (childNodes.indexOf(child) !== -1 || child.parentNode !== parent || child.previousSibling !== previousSibling) {
      throw new Error('Inconsistent child nodes');
    }

    childNodes.push(child);
    previousSibling = child;
  }

  if (parent.lastChild !== previousSibling) {
    throw new Error('Inconsistent child nodes');
  }

  return childNodes;
}
