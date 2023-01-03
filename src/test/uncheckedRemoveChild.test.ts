import { Text } from '../main/Text';
import { Element } from '../main/Element';
import { uncheckedAppendChild } from '../main/uncheckedAppendChild';
import { uncheckedRemoveChild } from '../main/uncheckedRemoveChild';
import { CHILD_NODES, CHILDREN } from '../main/utils';

describe('uncheckedRemove', () => {
  test('removes the only child', () => {
    const parent = new Element('parent');
    const node = new Text('node');

    uncheckedAppendChild(parent, node);
    uncheckedRemoveChild(parent, node);

    expect(parent[CHILD_NODES]).toBe(undefined);
    expect(parent.firstChild).toBe(null);
    expect(parent.lastChild).toBe(null);
    expect(parent.firstElementChild).toBe(null);
    expect(parent.lastElementChild).toBe(null);

    expect(node.parentNode).toBe(null);
    expect(node.parentElement).toBe(null);
    expect(node.previousSibling).toBe(null);
    expect(node.nextSibling).toBe(null);
    expect(node.previousElementSibling).toBe(null);
    expect(node.nextElementSibling).toBe(null);
  });

  test('removes the middle child', () => {
    const parent = new Element('parent');
    const node1 = new Text('node1');
    const node2 = new Text('node2');
    const node3 = new Text('node3');

    uncheckedAppendChild(parent, node1);
    uncheckedAppendChild(parent, node2);
    uncheckedAppendChild(parent, node3);
    uncheckedRemoveChild(parent, node2);

    expect(parent[CHILD_NODES]).toBe(undefined);
    expect(parent.firstChild).toBe(node1);
    expect(parent.lastChild).toBe(node3);
    expect(parent.firstElementChild).toBe(null);
    expect(parent.lastElementChild).toBe(null);

    expect(node1.parentNode).toBe(parent);
    expect(node1.parentElement).toBe(parent);
    expect(node1.previousSibling).toBe(null);
    expect(node1.nextSibling).toBe(node3);
    expect(node1.previousElementSibling).toBe(null);
    expect(node1.nextElementSibling).toBe(null);

    expect(node2.parentNode).toBe(null);
    expect(node2.parentElement).toBe(null);
    expect(node2.previousSibling).toBe(null);
    expect(node2.nextSibling).toBe(null);
    expect(node2.previousElementSibling).toBe(null);
    expect(node2.nextElementSibling).toBe(null);

    expect(node3.parentNode).toBe(parent);
    expect(node3.parentElement).toBe(parent);
    expect(node3.previousSibling).toBe(node1);
    expect(node3.nextSibling).toBe(null);
    expect(node3.previousElementSibling).toBe(null);
    expect(node3.nextElementSibling).toBe(null);
  });

  test('updates childNodes', () => {
    const parent = new Element('parent');
    const node1 = new Text('node1');
    const node2 = new Text('node2');
    const node3 = new Text('node3');

    expect(parent.childNodes.length).toBe(0);
    expect(parent.children.length).toBe(0);

    uncheckedAppendChild(parent, node1);
    uncheckedAppendChild(parent, node2);
    uncheckedAppendChild(parent, node3);
    uncheckedRemoveChild(parent, node2);

    expect(parent.childNodes.length).toBe(2);
    expect(parent.childNodes[0]).toBe(node1);
    expect(parent.childNodes[1]).toBe(node3);

    expect(parent.children.length).toBe(0);
  });

  test('removes the only element', () => {
    const parent = new Element('parent');
    const node = new Element('node');

    uncheckedAppendChild(parent, node);
    uncheckedRemoveChild(parent, node);

    expect(parent[CHILD_NODES]).toBe(undefined);
    expect(parent.firstChild).toBe(null);
    expect(parent.lastChild).toBe(null);
    expect(parent.firstElementChild).toBe(null);
    expect(parent.lastElementChild).toBe(null);

    expect(node.parentNode).toBe(null);
    expect(node.parentElement).toBe(null);
    expect(node.previousSibling).toBe(null);
    expect(node.nextSibling).toBe(null);
    expect(node.previousElementSibling).toBe(null);
    expect(node.nextElementSibling).toBe(null);
  });

  test('removes the middle element', () => {
    const parent = new Element('parent');
    const node1 = new Element('node1');
    const node2 = new Element('node2');
    const node3 = new Element('node3');

    uncheckedAppendChild(parent, node1);
    uncheckedAppendChild(parent, node2);
    uncheckedAppendChild(parent, node3);
    uncheckedRemoveChild(parent, node2);

    expect(parent[CHILDREN]).toBe(undefined);
    expect(parent.firstChild).toBe(node1);
    expect(parent.lastChild).toBe(node3);
    expect(parent.firstElementChild).toBe(node1);
    expect(parent.lastElementChild).toBe(node3);

    expect(node1.parentNode).toBe(parent);
    expect(node1.parentElement).toBe(parent);
    expect(node1.previousSibling).toBe(null);
    expect(node1.nextSibling).toBe(node3);
    expect(node1.previousElementSibling).toBe(null);
    expect(node1.nextElementSibling).toBe(node3);

    expect(node2.parentNode).toBe(null);
    expect(node2.parentElement).toBe(null);
    expect(node2.previousSibling).toBe(null);
    expect(node2.nextSibling).toBe(null);
    expect(node2.previousElementSibling).toBe(null);
    expect(node2.nextElementSibling).toBe(null);

    expect(node3.parentNode).toBe(parent);
    expect(node3.parentElement).toBe(parent);
    expect(node3.previousSibling).toBe(node1);
    expect(node3.nextSibling).toBe(null);
    expect(node3.previousElementSibling).toBe(node1);
    expect(node3.nextElementSibling).toBe(null);
  });

  test('updates children', () => {
    const parent = new Element('parent');
    const node1 = new Element('node1');
    const node2 = new Element('node2');
    const node3 = new Element('node3');

    expect(parent.childNodes.length).toBe(0);
    expect(parent.children.length).toBe(0);

    uncheckedAppendChild(parent, node1);
    uncheckedAppendChild(parent, node2);
    uncheckedAppendChild(parent, node3);
    uncheckedRemoveChild(parent, node2);

    expect(parent.childNodes.length).toBe(2);
    expect(parent.childNodes[0]).toBe(node1);
    expect(parent.childNodes[1]).toBe(node3);

    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(node1);
    expect(parent.children[1]).toBe(node3);
  });
});
