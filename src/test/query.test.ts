import { describe, expect, test } from 'vitest';
import { createElementFactory, h } from '../main/dsl.ts';
import { Comment, Document, Element, Text } from '../main/index.ts';
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

describe('NodeQuery.nextAll', () => {
  test('selects sibling elements that follow the node', () => {
    const root = h('aaa', h('bbb'), h('ccc'), 'xxx', h('ddd'), h('eee'));

    expect($(root.childNodes[1]).nextAll().nodes).toStrictEqual([root.childNodes[3], root.childNodes[4]]);
  });

  test('selects following sibling elements with the given local name and namespace', () => {
    const root = h('aaa', h('bbb'), h('ccc'), n('ccc'), h('ddd'));

    expect($(root.childNodes[0]).nextAll('ccc').nodes).toStrictEqual([root.childNodes[1], root.childNodes[2]]);
    expect($(root.childNodes[0]).nextAll('ccc', 'urn:111').nodes).toStrictEqual([root.childNodes[2]]);
  });

  test('selects an element once if it follows several nodes', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root).children().nextAll().nodes).toStrictEqual([root.childNodes[1], root.childNodes[2]]);
  });
});

describe('NodeQuery.previousAll', () => {
  test('selects sibling elements that precede the node, from the closest one to the farthest one', () => {
    const root = h('aaa', h('bbb'), h('ccc'), 'xxx', h('ddd'), h('eee'));

    expect($(root.childNodes[3]).previousAll().nodes).toStrictEqual([root.childNodes[1], root.childNodes[0]]);
  });

  test('selects preceding sibling elements with the given local name and namespace', () => {
    const root = h('aaa', h('bbb'), n('ccc'), h('ccc'), h('ddd'));

    expect($(root.childNodes[3]).previousAll('ccc').nodes).toStrictEqual([root.childNodes[2], root.childNodes[1]]);
    expect($(root.childNodes[3]).previousAll('ccc', 'urn:111').nodes).toStrictEqual([root.childNodes[1]]);
  });

  test('selects an element once if it precedes several nodes', () => {
    const root = h('aaa', h('bbb'), h('ccc'), h('ddd'));

    expect($(root).children().previousAll().nodes).toStrictEqual([root.childNodes[0], root.childNodes[1]]);
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
