import { Element, Text } from '../main';
import { uncheckedCloneChildren } from '../main/uncheckedCloneChildren';

test('clones a single children of source to target', () => {
  const sourceParent = new Element('sourceParent');
  const node = new Text('text');

  sourceParent.append(node);

  const targetParent = new Element('targetParent');

  uncheckedCloneChildren(sourceParent, targetParent);

  expect(sourceParent.childNodes.length).toBe(1);
  expect(sourceParent.firstChild).toBe(node);
  expect(node.parentNode).toBe(sourceParent);

  expect(targetParent.childNodes.length).toBe(1);
  expect(targetParent.firstChild).toBeInstanceOf(Text);
  expect(targetParent.firstChild).toBe(targetParent.lastChild);
  expect(targetParent.firstChild).not.toBe(node);
  expect(targetParent.firstChild!.parentNode).toBe(targetParent);
  expect(targetParent.firstChild!.previousSibling).toBeNull();
  expect(targetParent.firstChild!.nextSibling).toBeNull();
});

test('clones nested children of source to target', () => {
  const sourceParent = new Element('sourceParent');
  const node1 = new Element('node1');
  const node2 = new Element('node2');
  const node3 = new Text('node3');

  sourceParent.append(node1);
  node1.append(node2, node3);

  const targetParent = new Element('targetParent');

  uncheckedCloneChildren(sourceParent, targetParent);

  expect(targetParent.childNodes.length).toBe(1);
  expect(targetParent.firstChild).toBeInstanceOf(Element);
  expect(targetParent.firstChild).toBe(targetParent.lastChild);
  expect(targetParent.firstChild).not.toBe(node1);
  expect(targetParent.firstChild!.parentNode).toBe(targetParent);
  expect(targetParent.firstChild!.previousSibling).toBeNull();
  expect(targetParent.firstChild!.nextSibling).toBeNull();

  expect(targetParent.firstChild!.childNodes.length).toBe(2);
  expect(targetParent.firstChild!.firstChild).toBeInstanceOf(Element);
  expect(targetParent.firstChild!.lastChild).toBeInstanceOf(Text);
  expect(targetParent.firstChild!.firstChild!.parentNode).toBe(targetParent.firstChild);
  expect(targetParent.firstChild!.lastChild!.parentNode).toBe(targetParent.firstChild);
  expect(targetParent.firstChild!.firstChild!.previousSibling).toBeNull();
  expect(targetParent.firstChild!.firstChild!.nextSibling).toBe(targetParent.firstChild!.lastChild);
  expect(targetParent.firstChild!.lastChild!.previousSibling).toBe(targetParent.firstChild!.firstChild);
  expect(targetParent.firstChild!.lastChild!.nextSibling).toBeNull();
});
