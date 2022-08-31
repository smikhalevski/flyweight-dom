import { Element } from '../../main/Element';
import { Text } from '../../main/Text';
import { uncheckedAppendChild, uncheckedInsertBefore } from '../../main/unchecked';

describe('uncheckedInsertBefore', () => {
  test('inserts an element before another element', () => {
    const parent = new Element('parent');
    const node1 = new Element('node1');
    const node2 = new Element('node2');

    uncheckedAppendChild(parent, node2);
    uncheckedInsertBefore(parent, node1, node2);

    expect(parent._childNodes).toBe(null);
    expect(parent._children).toBe(null);
    expect(parent.firstChild).toBe(node1);
    expect(parent.lastChild).toBe(node2);
    expect(parent.firstElementChild).toBe(node1);
    expect(parent.lastElementChild).toBe(node2);

    expect(node1.parentNode).toBe(parent);
    expect(node1.parentElement).toBe(parent);
    expect(node1.previousSibling).toBe(null);
    expect(node1.nextSibling).toBe(node2);
    expect(node1.previousElementSibling).toBe(null);
    expect(node1.nextElementSibling).toBe(node2);

    expect(node2.parentNode).toBe(parent);
    expect(node2.parentElement).toBe(parent);
    expect(node2.previousSibling).toBe(node1);
    expect(node2.nextSibling).toBe(null);
    expect(node2.previousElementSibling).toBe(node1);
    expect(node2.nextElementSibling).toBe(null);
  });

  test('inserts an element before a node followed by an element', () => {
    const parent = new Element('parent');
    const node1 = new Element('node1');
    const text2 = new Text('node2');
    const node3 = new Element('node3');

    uncheckedAppendChild(parent, text2);
    uncheckedAppendChild(parent, node3);
    uncheckedInsertBefore(parent, node1, text2);

    expect(parent.firstChild).toBe(node1);
    expect(parent.lastChild).toBe(node3);
    expect(parent.firstElementChild).toBe(node1);
    expect(parent.lastElementChild).toBe(node3);

    expect(node1.parentNode).toBe(parent);
    expect(node1.parentElement).toBe(parent);
    expect(node1.previousSibling).toBe(null);
    expect(node1.nextSibling).toBe(text2);
    expect(node1.previousElementSibling).toBe(null);
    expect(node1.nextElementSibling).toBe(node3);

    expect(text2.parentNode).toBe(parent);
    expect(text2.parentElement).toBe(parent);
    expect(text2.previousSibling).toBe(node1);
    expect(text2.nextSibling).toBe(node3);
    expect(text2.previousElementSibling).toBe(node1);
    expect(text2.nextElementSibling).toBe(node3);
  });

  test('updates childNodes and children', () => {
    const parent = new Element('parent');
    const node1 = new Element('node1');
    const node2 = new Element('node2');

    expect(parent.childNodes.length).toBe(0);
    expect(parent.children.length).toBe(0);

    uncheckedAppendChild(parent, node2);
    uncheckedInsertBefore(parent, node1, node2);

    expect(parent.childNodes.length).toBe(2);
    expect(parent.childNodes[0]).toBe(node1);
    expect(parent.childNodes[1]).toBe(node2);

    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(node1);
    expect(parent.children[1]).toBe(node2);
  });
});
