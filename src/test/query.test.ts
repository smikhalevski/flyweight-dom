import { describe, expect, test } from 'vitest';
import { createElementFactory, h } from '../main/dsl.ts';
import { ChildNode, Comment, Document, Element, ParentNode, Text } from '../main/index.ts';
import { $, NodeQuery } from '../main/query.ts';

const n = createElementFactory('urn:111');

describe('$', () => {
  test('creates a query that holds the node', () => {
    const document = new Document();
    const query = $(document);

    expect(query).toBeInstanceOf(NodeQuery);
    expect(query.nodes).toStrictEqual([document]);
  });
});

describe('NodeQuery.children', () => {
  test('selects all child elements by default', () => {
    const root = h('aaa', 'xxx', h('bbb', h('ccc')), n('ddd'));

    expect($(root).children().nodes).toStrictEqual([root.childNodes[1], root.childNodes[2]]);
  });

  test('selects child elements with the given local name in any namespace', () => {
    const root = h('aaa', h('bbb'), h('ccc'), n('xxx:bbb'), h('ddd', h('bbb')));

    expect($(root).children('bbb').nodes).toStrictEqual([root.childNodes[0], root.childNodes[2]]);
  });

  test('selects child elements with the given local name and namespace', () => {
    const root = h('aaa', h('bbb'), n('bbb'), n('ccc'));

    expect($(root).children('bbb', 'urn:111').nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('selects child elements with any local name in the given namespace', () => {
    const root = h('aaa', h('bbb'), n('bbb'), n('ccc'));

    expect($(root).children('*', 'urn:111').nodes).toStrictEqual([root.childNodes[1], root.childNodes[2]]);
  });

  test('selects child elements without a namespace if the namespace is null', () => {
    const root = h('aaa', h('bbb'), n('bbb'));

    expect($(root).children('bbb', null).nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects children of each node', () => {
    const root = h('aaa', h('bbb', h('ccc')), h('bbb', h('ddd')));

    expect($(root).children().children().nodes).toStrictEqual([
      root.childNodes[0].firstChild,
      root.childNodes[1].firstChild,
    ]);
  });
});

describe('NodeQuery.descendants', () => {
  test('selects all descendant elements by default', () => {
    const root = h('aaa', 'xxx', h('bbb', n('ccc')));

    expect($(root).descendants().nodes).toStrictEqual([root.childNodes[1], root.childNodes[1].firstChild]);
  });

  test('selects descendant elements with the given local name in any namespace', () => {
    const root = h('aaa', h('bbb', n('xxx:ccc')), h('ccc'));

    expect($(root).descendants('ccc').nodes).toStrictEqual([root.childNodes[0].firstChild, root.childNodes[1]]);
  });

  test('selects descendant elements with the given local name and namespace', () => {
    const root = h('aaa', h('bbb', n('ccc')), h('ccc'));

    expect($(root).descendants('ccc', 'urn:111').nodes).toStrictEqual([root.childNodes[0].firstChild]);
  });

  test('does not select the node itself', () => {
    expect($(h('aaa')).descendants('aaa').nodes).toStrictEqual([]);
  });

  test('selects an element once if nodes are nested', () => {
    const element = h('ccc');
    const root = h('aaa', h('bbb', h('bbb', element)));

    expect($(root).descendants('bbb').descendants('ccc').nodes).toStrictEqual([element]);
  });

  test('selects descendants of each node that is not nested', () => {
    const root = h('aaa', h('bbb', h('ccc')), h('bbb', h('ccc')));

    expect($(root).children('bbb').descendants('ccc').nodes).toStrictEqual([
      root.childNodes[0].firstChild,
      root.childNodes[1].firstChild,
    ]);
  });

  test('selects an element once if a nested node goes before the node that contains it', () => {
    const element = h('ddd');
    const root = h('aaa', h('bbb', h('ccc', element)));
    const query = $(root).descendants('ccc').union($(root).children('bbb'));

    expect(query.descendants().nodes).toStrictEqual([root.firstChild!.firstChild, element]);
  });

  test('selects descendants of a node if other nodes have no children', () => {
    const root = h('aaa', h('bbb'), h('ccc', h('ddd')), h('eee'));

    expect($(root).children().descendants().nodes).toStrictEqual([root.childNodes[1].firstChild]);
  });
});

describe('NodeQuery.hasAttribute', () => {
  test('selects elements that have the attribute', () => {
    const root = h('aaa', h('bbb', { xxx: '' }), h('ccc', { yyy: '111' }));

    expect($(root).children().hasAttribute('xxx').nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects elements whose attribute value matches the predicate', () => {
    const root = h('aaa', h('bbb', { xxx: '111' }), h('ccc', { xxx: '222' }), h('ddd'));

    expect(
      $(root)
        .children()
        .hasAttribute('xxx', value => value === '222').nodes
    ).toStrictEqual([root.childNodes[1]]);
  });

  test('selects elements whose attribute value is equal to the string', () => {
    const root = h('aaa', h('bbb', { xxx: '111' }), h('ccc', { xxx: '1112' }));

    expect($(root).children().hasAttribute('xxx', '111').nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects elements whose attribute value matches the regular expression', () => {
    const root = h('aaa', h('bbb', { xxx: '111' }), h('ccc', { xxx: '222' }));

    expect($(root).children().hasAttribute('xxx', /^2/).nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('matches a global regular expression from the start of each attribute value', () => {
    const root = h('aaa', h('bbb', { xxx: '111' }), h('ccc', { xxx: '111' }));
    const pattern = /1/g;

    expect($(root).children().hasAttribute('xxx', pattern).nodes).toStrictEqual(Array.from(root.childNodes));
    expect(pattern.lastIndex).toBe(0);
  });

  test('does not select nodes that are not elements', () => {
    expect($(new Document()).hasAttribute('xxx').nodes).toStrictEqual([]);
  });

  test('does not select elements by names of inherited properties', () => {
    expect($(h('aaa')).hasAttribute('constructor').nodes).toStrictEqual([]);
    expect($(h('aaa')).hasAttribute('__proto__').nodes).toStrictEqual([]);
  });

  test('selects an element that has an attribute with the name of an inherited property', () => {
    const element = h('aaa').setAttribute('__proto__', 'xxx');

    expect($(element).hasAttribute('__proto__', 'xxx').nodes).toStrictEqual([element]);
  });
});

describe('NodeQuery.hasAttributeNS', () => {
  test('selects elements that have the attribute with the given namespace and local name', () => {
    const root = h(
      'aaa',
      { 'xmlns:xxx': 'urn:111', 'xmlns:yyy': 'urn:111', 'xmlns:zzz': 'urn:222' },
      h('bbb', { 'xxx:eee': '' }),
      h('bbb', { 'yyy:eee': '' }),
      h('bbb', { 'zzz:eee': '' }),
      h('bbb', { eee: '' })
    );

    expect($(root).children().hasAttributeNS('urn:111', 'eee').nodes).toStrictEqual([
      root.childNodes[0],
      root.childNodes[1],
    ]);
  });

  test('selects elements whose attribute value meets the predicate', () => {
    const root = h('aaa', { 'xmlns:xxx': 'urn:111' }, h('bbb', { 'xxx:eee': '111' }), h('bbb', { 'xxx:eee': '222' }));

    expect($(root).children().hasAttributeNS('urn:111', 'eee', '222').nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('does not select nodes that are not elements', () => {
    expect($(new Document()).hasAttributeNS('urn:111', 'eee').nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.at', () => {
  test('selects the node at the index', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root).children().at(1).nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('counts a negative index from the last node', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root).children().at(-2).nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('selects nothing if the index is out of range', () => {
    const root = h('aaa', h('bbb'));

    expect($(root).children().at(1).nodes).toStrictEqual([]);
    expect($(root).children().at(-2).nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.first', () => {
  test('selects the first node', () => {
    const root = h('aaa', h('bbb'), h('ccc'));

    expect($(root).children().first().nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects nothing if there are no nodes', () => {
    expect($(h('aaa')).children().first().nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.last', () => {
  test('selects the last node', () => {
    const root = h('aaa', h('bbb'), h('ccc'));

    expect($(root).children().last().nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('selects nothing if there are no nodes', () => {
    expect($(h('aaa')).children().last().nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.hasClass', () => {
  test('selects elements that have the class', () => {
    const root = h('aaa', h('bbb', { class: 'xxx yyy' }), h('ccc', { class: 'xxxyyy' }), h('ddd'));

    expect($(root).children().hasClass('yyy').nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects elements that have all given classes', () => {
    const root = h('aaa', h('bbb', { class: 'xxx yyy' }), h('ccc', { class: 'xxx' }));

    expect($(root).children().hasClass('yyy xxx').nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects nothing if the class name is blank', () => {
    expect($(h('aaa')).hasClass(' ').nodes).toStrictEqual([]);
  });

  test('does not select nodes that are not elements', () => {
    expect($(new Document()).hasClass('xxx').nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.nthChild', () => {
  test('selects elements at the index among element children of their parents', () => {
    const root = h('aaa', h('bbb', 'xxx', h('ccc'), h('ddd')), h('eee', h('fff'), 'xxx', h('ggg')));

    expect($(root).descendants().nthChild(1).nodes).toStrictEqual([
      root.childNodes[0].childNodes[2],
      root.childNodes[1],
      root.childNodes[1].childNodes[2],
    ]);
  });

  test('counts a negative index from the last child', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'), 'xxx');

    expect($(root).children().nthChild(-1).nodes).toStrictEqual([root.childNodes[2]]);
    expect($(root).children().nthChild(-3).nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects nothing if the index is out of range', () => {
    const root = h('aaa', h('bbb'));

    expect($(root).children().nthChild(1).nodes).toStrictEqual([]);
    expect($(root).children().nthChild(-2).nodes).toStrictEqual([]);
  });

  test('does not select nodes that are not elements', () => {
    expect($(new Text()).nthChild(0).nodes).toStrictEqual([]);
    expect($(new Text()).nthChild(1).nodes).toStrictEqual([]);
  });

  test('selects elements in a long run of siblings', () => {
    const root = h('aaa', h('bbb'), 'xxx', h('ccc'), h('ddd'), 'xxx', h('eee'), h('fff'), h('ggg'));

    expect($(root).children().nthChild(4).nodes).toStrictEqual([root.childNodes[6]]);
    expect($(root).children().nthChild(-5).nodes).toStrictEqual([root.childNodes[2]]);
  });

  test('does not select siblings that follow a sibling whose index is too big', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'), h('eee'), h('fff'), h('ggg'));
    const query = $(root)
      .children()
      .filter((_element, index) => index >= 3);

    expect(query.nthChild(1).nodes).toStrictEqual([]);
    expect(query.nthChild(4).nodes).toStrictEqual([root.childNodes[4]]);
  });

  test('does not select siblings that precede a sibling whose negative index is too big', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'), h('eee'), h('fff'), h('ggg'));
    const query = $(root)
      .children()
      .filter((_element, index) => index < 3);

    expect(query.nthChild(-2).nodes).toStrictEqual([]);
    expect(query.nthChild(-5).nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('selects elements of different parents that are not in the document order', () => {
    const root = h('aaa', h('bbb', h('ccc'), h('ddd'), h('eee')), h('fff', h('ggg'), h('hhh')));
    const elements = $(root).descendants().nodes;
    const query = new NodeQuery([elements[6], elements[3], elements[4], elements[1], elements[5], elements[2]]);

    expect(query.nthChild(1).nodes).toStrictEqual([elements[6], elements[4], elements[2]]);
    expect(query.nthChild(-2).nodes).toStrictEqual([elements[5], elements[2]]);
  });
});

describe('NodeQuery.firstChild', () => {
  test('selects elements that are the first element children of their parents', () => {
    const root = h('aaa', 'xxx', h('bbb'), h('ccc'));

    expect($(root).children().firstChild().nodes).toStrictEqual([root.childNodes[1]]);
  });
});

describe('NodeQuery.lastChild', () => {
  test('selects elements that are the last element children of their parents', () => {
    const root = h('aaa', h('bbb'), h('ccc'), 'xxx');

    expect($(root).children().lastChild().nodes).toStrictEqual([root.childNodes[1]]);
  });
});

describe('NodeQuery.hasNoContent', () => {
  test('selects nodes that have neither child elements nor text', () => {
    const root = h('aaa', h('bbb'), h('ccc', h('ddd')), h('eee', 'xxx'), h('fff', new Comment('xxx'), new Text()));

    expect($(root).children().hasNoContent().nodes).toStrictEqual([root.childNodes[0], root.childNodes[3]]);
  });
});

describe('NodeQuery.union', () => {
  test('selects nodes of both queries once', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));
    const query = $(root).children();

    expect(query.at(1).union(query.at(0)).union(query).nodes).toStrictEqual([
      root.childNodes[1],
      root.childNodes[0],
      root.childNodes[2],
    ]);
  });

  test('selects nodes of both queries once if both have many nodes', () => {
    const root = h('aaa');

    for (let i = 0; i < 40; ++i) {
      root.append(h('bbb'));
    }

    const { nodes } = $(root).children();
    const query1 = new NodeQuery(nodes.slice(0, 30));
    const query2 = new NodeQuery(nodes.slice(10));
    const unionNodes = query1.union(query2).nodes;

    // Nodes are compared by reference, since a deep comparison of many siblings is slow
    expect(unionNodes.length).toBe(40);
    expect(unionNodes.every((node, index) => node === nodes[index])).toBe(true);
  });

  test('selects nodes of a query if the other query has no nodes', () => {
    const root = h('aaa', h('bbb'));
    const query = $(root).children();
    const emptyQuery = query.children();

    expect(query.union(emptyQuery).nodes).toStrictEqual([root.firstChild]);
    expect(emptyQuery.union(query).nodes).toStrictEqual([root.firstChild]);
  });
});

describe('NodeQuery.hasText', () => {
  test('selects nodes that have a non-empty text content by default', () => {
    const root = h('aaa', h('bbb', h('ccc', 'xxx')), h('ddd'));

    expect($(root).children().hasText().nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects nodes whose text content is equal to the string', () => {
    const root = h('aaa', h('bbb', 'xxx', h('ccc', 'yyy')), h('ddd', 'xxx'));

    expect($(root).children().hasText('xxxyyy').nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects nodes whose text content matches the regular expression', () => {
    const root = h('aaa', h('bbb', 'xxx'), h('ccc', 'yyy'));

    expect($(root).children().hasText(/^y/).nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('does not select a node without text content', () => {
    expect($(new Document()).hasText(() => true).nodes).toStrictEqual([]);
  });

  test('does not select nodes whose text content only starts with the string, or is the start of the string', () => {
    const root = h('aaa', h('bbb', 'xxx', h('ccc', 'yyy')));

    expect($(root).children().hasText('xxx').nodes).toStrictEqual([]);
    expect($(root).children().hasText('xxxyyyzzz').nodes).toStrictEqual([]);
  });

  test('reads text and CDATA sections of descendants, and ignores comments', () => {
    const root = h('aaa', h('bbb', 'xxx', h.comment('zzz'), h('ccc', h.cdata('yyy'))), h('ddd', h.comment('zzz')));

    expect($(root).children().hasText('xxxyyy').nodes).toStrictEqual([root.childNodes[0]]);
    expect($(root).children().hasText().nodes).toStrictEqual([root.childNodes[0]]);
    expect($(root).children().hasText('').nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('ignores text nodes without data', () => {
    const element = h('aaa', new Text(), 'xxx', new Text());

    expect($(element).hasText('xxx').nodes).toStrictEqual([element]);
  });

  test('selects a fragment and a text node by their text content', () => {
    const fragment = h.fragment('xxx', h('aaa', 'yyy'));
    const text = new Text('xxx');

    expect($(fragment).hasText('xxxyyy').nodes).toStrictEqual([fragment]);
    expect($(text).hasText('xxx').nodes).toStrictEqual([text]);
    expect($(text).hasText('yyy').nodes).toStrictEqual([]);
  });

  test('does not read text of a custom node, the same as the text content of an element', () => {
    class MockParentNode extends ParentNode(ChildNode()) {
      readonly nodeName = '';
      readonly nodeType = -1;
    }

    const element = h('aaa', new MockParentNode().append('xxx'));

    expect(element.textContent).toBe('');
    expect($(element).hasText().nodes).toStrictEqual([]);
    expect($(element).hasText('xxx').nodes).toStrictEqual([]);
  });

  test('reads the text content that a subclass of an element defines', () => {
    class MockElement extends Element {
      get textContent(): string | null {
        return 'xxx';
      }

      set textContent(_value: string | null | undefined) {}
    }

    const element = new MockElement('aaa');

    expect($(element).hasText('xxx').nodes).toStrictEqual([element]);
    expect($(element).hasText().nodes).toStrictEqual([element]);
  });
});

describe('NodeQuery.filter', () => {
  test('selects nodes that pass the predicate', () => {
    const root = h('aaa', h('bbb', 'xxx'), h('ccc'));

    expect(
      $(root)
        .children()
        .filter(element => element.textContent === 'xxx').nodes
    ).toStrictEqual([root.childNodes[0]]);
  });
});

describe('NodeQuery.not', () => {
  test('selects nodes that do not pass the predicate', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect(
      $(root)
        .children()
        .not((element, index) => element.tagName === 'bbb' || index === 2).nodes
    ).toStrictEqual([root.childNodes[1]]);
  });
});

describe('NodeQuery.has', () => {
  test('selects nodes that have a descendant with the given local name and namespace', () => {
    const root = h('aaa', h('bbb', h('ccc', n('ddd'))), h('bbb', h('ddd')), h('bbb'));

    expect($(root).children().has('ddd', 'urn:111').nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects nodes that have any descendant element by default', () => {
    const root = h('aaa', h('bbb', h('ccc')), h('bbb', 'xxx'));

    expect($(root).children().has().nodes).toStrictEqual([root.childNodes[0]]);
  });

  test('selects a node once if it has several matching descendants', () => {
    const root = h('aaa', h('bbb'), h('bbb'));

    expect($(root).has('bbb').nodes).toStrictEqual([root]);
  });

  test('does not select a node that only matches itself', () => {
    expect($(h('aaa')).has('aaa').nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.parent', () => {
  test('selects the parent element once if it is the parent of several nodes', () => {
    const root = h('aaa', h('bbb', h('ccc'), h('ddd')));

    expect($(root).descendants().parent('bbb').nodes).toStrictEqual([root.firstChild]);
  });

  test('selects nothing if the parent does not match', () => {
    const root = h('aaa', h('bbb'));

    expect($(root).children().parent('ccc').nodes).toStrictEqual([]);
    expect($(root).children().parent('aaa', 'urn:111').nodes).toStrictEqual([]);
  });

  test('does not select a parent that is not an element', () => {
    const element = h('aaa');

    h.document(element);

    expect($(element).parent().nodes).toStrictEqual([]);
  });

  test('selects nothing if the node has no parent', () => {
    expect($(h('aaa')).parent().nodes).toStrictEqual([]);
  });

  test('selects the parent element once if its children are not in a row', () => {
    const root = h('aaa', h('bbb', h('ccc'), h('ddd')), h('eee', h('fff')));
    const elements = $(root).descendants().nodes;
    const query = new NodeQuery([elements[1], elements[4], elements[2]]);

    expect(query.parent().nodes).toStrictEqual([root.childNodes[0], root.childNodes[1]]);
  });
});

describe('NodeQuery.ancestors', () => {
  test('selects ancestor elements from the closest one to the farthest one', () => {
    const element = h('ddd');
    const root = h('aaa', h('bbb', h('ccc', element)));

    h.document(root);

    expect($(element).ancestors().nodes).toStrictEqual([root.firstChild!.firstChild, root.firstChild, root]);
  });

  test('selects ancestor elements with the given local name and namespace', () => {
    const element = h('ccc');
    const root = n('bbb', h('aaa', h('bbb', element)));

    expect($(element).ancestors('bbb').nodes).toStrictEqual([root.firstChild!.firstChild, root]);
    expect($(element).ancestors('bbb', 'urn:111').nodes).toStrictEqual([root]);
  });

  test('selects an element once if it is an ancestor of several nodes', () => {
    const root = h('aaa', h('bbb', h('ccc')), h('bbb', h('ccc')));

    expect($(root).descendants('ccc').ancestors().nodes).toStrictEqual([root.childNodes[0], root, root.childNodes[1]]);
  });

  test('does not select the node itself', () => {
    expect($(h('aaa')).ancestors('aaa').nodes).toStrictEqual([]);
  });

  test('selects ancestors of siblings once', () => {
    const root = h('aaa', h('bbb', h('ccc'), h('ddd')));

    expect($(root.firstChild!).children().ancestors().nodes).toStrictEqual([root.firstChild, root]);
  });
});

describe('NodeQuery.closest', () => {
  test('selects the closest ancestor with the given local name and namespace', () => {
    const element = h('ddd');
    const root = h('aaa', n('bbb', h('bbb', h('ccc', element))));

    expect($(element).closest('bbb').nodes).toStrictEqual([root.firstChild!.firstChild]);
    expect($(element).closest('bbb', 'urn:111').nodes).toStrictEqual([root.firstChild]);
  });

  test('selects the node itself if it matches', () => {
    const element = h('aaa');

    h('aaa', element);

    expect($(element).closest('aaa').nodes).toStrictEqual([element]);
  });

  test('selects an element once if it is the closest one for several nodes', () => {
    const root = h('aaa', h('bbb'), h('ccc'));

    expect($(root).children().closest('aaa').nodes).toStrictEqual([root]);
  });

  test('selects nothing if there is no matching ancestor', () => {
    expect(
      $(h('aaa', h('bbb')))
        .children()
        .closest('ccc').nodes
    ).toStrictEqual([]);
  });

  test('selects an element once if it matches itself and is the closest one for its descendants', () => {
    const root = h('aaa', h('bbb', h('ccc'), h('bbb'), h('ddd')));
    const element = root.firstChild!;

    expect($(root).descendants().closest('bbb').nodes).toStrictEqual([element, element.childNodes[1]]);
  });
});

describe('NodeQuery.siblings', () => {
  test('selects sibling elements, but not the node itself', () => {
    const root = h('aaa', h('bbb'), 'xxx', h('ccc'), h('ddd'));

    expect($(root.childNodes[2]).siblings().nodes).toStrictEqual([root.childNodes[0], root.childNodes[3]]);
  });

  test('selects sibling elements with the given local name and namespace', () => {
    const root = h('aaa', h('bbb'), h('ccc'), n('ccc'));

    expect($(root.childNodes[0]).siblings('ccc', 'urn:111').nodes).toStrictEqual([root.childNodes[2]]);
  });

  test('selects nodes that are siblings of each other once', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root).children().siblings().nodes).toStrictEqual(Array.from(root.childNodes));
  });

  test('selects nothing if the node has no parent', () => {
    expect($(h('aaa')).siblings().nodes).toStrictEqual([]);
  });

  test('selects nothing if several nodes have no parents', () => {
    expect(new NodeQuery([h('aaa'), h('bbb')]).siblings().nodes).toStrictEqual([]);
  });

  test('selects siblings of nodes that have different parents', () => {
    const root = h('aaa', h('bbb', h('ccc'), h('ddd')), h('eee', h('ccc'), h('fff')));

    expect($(root).descendants('ccc').siblings().nodes).toStrictEqual([
      root.childNodes[0].childNodes[1],
      root.childNodes[1].childNodes[1],
    ]);
  });
});

describe('NodeQuery.next', () => {
  test('selects the next sibling element', () => {
    const root = h('aaa', h('bbb'), 'xxx', h('ccc'), h('ddd'));

    expect($(root.childNodes[0]).next().nodes).toStrictEqual([root.childNodes[2]]);
  });

  test('selects nothing if the next sibling element does not match', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root.childNodes[0]).next('ddd').nodes).toStrictEqual([]);
    expect($(root.childNodes[0]).next('ccc', 'urn:111').nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.previous', () => {
  test('selects the previous sibling element', () => {
    const root = h('aaa', h('bbb'), h('ccc'), 'xxx', h('ddd'));

    expect($(root.childNodes[3]).previous().nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('selects nothing if the previous sibling element does not match', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root.childNodes[2]).previous('bbb').nodes).toStrictEqual([]);
    expect($(root.childNodes[2]).previous('ccc', 'urn:111').nodes).toStrictEqual([]);
  });
});

describe('NodeQuery.following', () => {
  test('selects sibling elements that follow the node', () => {
    const root = h('aaa', h('bbb'), h('ccc'), 'xxx', h('ddd'), h('eee'));

    expect($(root.childNodes[1]).following().nodes).toStrictEqual([root.childNodes[3], root.childNodes[4]]);
  });

  test('selects following sibling elements with the given local name and namespace', () => {
    const root = h('aaa', h('bbb'), h('ccc'), n('ccc'), h('ddd'));

    expect($(root.childNodes[0]).following('ccc').nodes).toStrictEqual([root.childNodes[1], root.childNodes[2]]);
    expect($(root.childNodes[0]).following('ccc', 'urn:111').nodes).toStrictEqual([root.childNodes[2]]);
  });

  test('selects an element once if it follows several nodes', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root).children().following().nodes).toStrictEqual([root.childNodes[1], root.childNodes[2]]);
  });

  test('selects following siblings of nodes that are not in the document order', () => {
    const root = h('aaa', h('bbb'), 'xxx', h('ccc'), h('ddd'), 'xxx', h('eee'));
    const elements = $(root).children().nodes;
    const query = new NodeQuery([elements[2], elements[0], elements[1]]);

    expect(query.following().nodes).toStrictEqual([elements[3], elements[1], elements[2]]);
  });
});

describe('NodeQuery.preceding', () => {
  test('selects sibling elements that precede the node, from the closest one to the farthest one', () => {
    const root = h('aaa', h('bbb'), h('ccc'), 'xxx', h('ddd'), h('eee'));

    expect($(root.childNodes[3]).preceding().nodes).toStrictEqual([root.childNodes[1], root.childNodes[0]]);
  });

  test('selects preceding sibling elements with the given local name and namespace', () => {
    const root = h('aaa', h('bbb'), n('ccc'), h('ccc'), h('ddd'));

    expect($(root.childNodes[3]).preceding('ccc').nodes).toStrictEqual([root.childNodes[2], root.childNodes[1]]);
    expect($(root.childNodes[3]).preceding('ccc', 'urn:111').nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('selects an element once if it precedes several nodes', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root).children().preceding().nodes).toStrictEqual([root.childNodes[0], root.childNodes[1]]);
  });

  test('selects preceding siblings of nodes that are not in the document order', () => {
    const root = h('aaa', h('bbb'), 'xxx', h('ccc'), h('ddd'), 'xxx', h('eee'));
    const elements = $(root).children().nodes;
    const query = new NodeQuery([elements[1], elements[3], elements[2]]);

    expect(query.preceding().nodes).toStrictEqual([elements[0], elements[2], elements[1]]);
  });
});

describe('NodeQuery.getAttribute', () => {
  test('returns the attribute value of the first node', () => {
    const root = h('aaa', h('bbb', { xxx: '111' }), h('ccc', { xxx: '222' }));

    expect($(root).children().getAttribute('xxx')).toBe('111');
  });

  test('returns null if the first node has no such attribute', () => {
    expect($(h('aaa')).getAttribute('xxx')).toBeNull();
  });

  test('returns null if the first node is not an element', () => {
    expect($(new Document()).getAttribute('xxx')).toBeNull();
  });

  test('returns null if there are no nodes', () => {
    expect($(h('aaa')).children().getAttribute('xxx')).toBeNull();
  });
});

describe('NodeQuery.getAttributeNS', () => {
  test('returns the value of the attribute with the given namespace and local name of the first node', () => {
    const root = h('aaa', { 'xmlns:xxx': 'urn:111' }, h('bbb', { 'xxx:eee': '111', eee: '222' }), h('bbb'));

    expect($(root).children().getAttributeNS('urn:111', 'eee')).toBe('111');
  });

  test('returns null if the first node is not an element', () => {
    expect($(new Document()).getAttributeNS('urn:111', 'eee')).toBeNull();
  });

  test('returns null if there are no nodes', () => {
    expect($(h('aaa')).children().getAttributeNS('urn:111', 'eee')).toBeNull();
  });
});

describe('NodeQuery.text', () => {
  test('returns the concatenated text content of nodes', () => {
    const root = h('aaa', h('bbb', 'xxx', h('ccc', 'yyy')), h('ddd', 'zzz'));

    expect($(root).children().text()).toBe('xxxyyyzzz');
  });

  test('returns an empty string for a node without text content', () => {
    expect($(new Document()).text()).toBe('');
  });
});

describe('NodeQuery.remove', () => {
  test('removes nodes from their parents and keeps them in the query', () => {
    const element = h('bbb');
    const root = h('aaa', element, 'xxx');
    const query = $(root).children();

    expect(query.remove()).toBe(query);
    expect(root.childNodes.length).toBe(1);
    expect(query.nodes).toStrictEqual([element]);
  });

  test('does not throw if a node has no parent', () => {
    expect($(h('aaa')).remove().nodes.length).toBe(1);
  });
});

describe('NodeQuery[Symbol.iterator]', () => {
  test('iterates over nodes', () => {
    const element = new Element('aaa');

    expect(Array.from($(element))).toStrictEqual([element]);
  });
});
