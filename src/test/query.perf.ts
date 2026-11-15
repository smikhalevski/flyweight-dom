import * as domutils from 'domutils';
import { describe, measure, test } from 'toofast';
// @ts-ignore
import { $ } from '../../lib/query.js';
import {
  ATTRIBUTE_NAMESPACE,
  domhandlerFactory,
  ELEMENT_NAMESPACE,
  flyweightFactory,
  flyweightNamespaceFactory,
  makeTestJsdom,
  makeTestParent,
  makeTestTree,
} from './perf-utils.ts';

/**
 * The number of children of the parent whose children are queried. Half of them are elements.
 */
const CHILD_COUNT = 1000;

/**
 * Returns a query that holds 340 descendant elements of the test tree. Elements are in the document order and most of
 * them are nested in each other, so methods have to tell which elements they've read already.
 */
function makeTestQuery() {
  return $(makeTestTree(flyweightFactory)).descendants();
}

/**
 * Returns a query that holds 340 descendant elements of the test tree, which have a namespace. The root of the tree
 * binds the "yyy" prefix to {@link ATTRIBUTE_NAMESPACE}, and every third element has the "yyy:ccc" attribute.
 */
function makeTestNamespaceQuery() {
  const tree = makeTestTree(flyweightNamespaceFactory);
  const query = $(tree).descendants();

  tree.setAttribute('xmlns:yyy', ATTRIBUTE_NAMESPACE);

  for (const element of query.nodes) {
    if (element.hasAttribute('name')) {
      element.setAttribute('yyy:ccc', 'ddd');
    }
  }

  return query;
}

/**
 * Returns a query that holds 500 span elements, which are children of the same parent and have texts between them.
 */
function makeTestSiblingsQuery() {
  return $(makeTestParent(flyweightFactory, CHILD_COUNT)).children();
}

describe('NodeQuery.children', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.children('span'));
  });
});

describe('NodeQuery.descendants', () => {
  test('flyweight-dom', () => {
    const query = $(makeTestTree(flyweightFactory));

    measure(() => query.descendants('span'));
  });

  test('domhandler', () => {
    const tree = makeTestTree(domhandlerFactory);

    measure(() => domutils.getElementsByTagName('span', tree.children));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const tree = makeTestTree(factory);

    measure(() => tree.querySelectorAll('span').length);
  });
});

describe('NodeQuery.descendants with a namespace', () => {
  test('flyweight-dom', () => {
    const query = $(makeTestTree(flyweightNamespaceFactory));

    measure(() => query.descendants('span', ELEMENT_NAMESPACE));
  });
});

describe('NodeQuery.descendants of nested nodes', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.descendants('span'));
  });
});

describe('NodeQuery.parent', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.parent());
  });
});

describe('NodeQuery.ancestors', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.ancestors());
  });
});

describe('NodeQuery.closest', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.closest('div'));
  });
});

describe('NodeQuery.closest of a single node', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery().last();

    measure(() => query.closest('div'));
  });

  test('jsdom', async () => {
    const { factory } = await makeTestJsdom();
    const element = makeTestTree(factory).querySelector('#id340');

    measure(() => element.closest('div'));
  });
});

describe('NodeQuery.siblings', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.siblings());
  });
});

describe('NodeQuery.next', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.next());
  });
});

describe('NodeQuery.previous', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.previous());
  });
});

describe('NodeQuery.following', () => {
  test('flyweight-dom', () => {
    const query = makeTestSiblingsQuery();

    measure(() => query.following());
  });
});

describe('NodeQuery.following of a single node', () => {
  test('flyweight-dom', () => {
    const query = makeTestSiblingsQuery().first();

    measure(() => query.following());
  });
});

describe('NodeQuery.preceding', () => {
  test('flyweight-dom', () => {
    const query = makeTestSiblingsQuery();

    measure(() => query.preceding());
  });
});

describe('NodeQuery.has', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.has('span'));
  });
});

describe('NodeQuery.hasAttribute', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasAttribute('name'));
  });
});

describe('NodeQuery.hasAttribute with a string', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasAttribute('class', 'ddd'));
  });
});

describe('NodeQuery.hasAttribute with a regular expression', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasAttribute('class', /^d/));
  });
});

describe('NodeQuery.hasAttribute with a callback', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasAttribute('class', (value: string) => value === 'ddd'));
  });
});

describe('NodeQuery.hasAttributeNS', () => {
  test('flyweight-dom', () => {
    const query = makeTestNamespaceQuery();

    measure(() => query.hasAttributeNS(ATTRIBUTE_NAMESPACE, 'ccc'));
  });
});

describe('NodeQuery.hasAttributeNS with any namespace', () => {
  test('flyweight-dom', () => {
    const query = makeTestNamespaceQuery();

    measure(() => query.hasAttributeNS('*', 'ccc'));
  });
});

describe('NodeQuery.hasClass', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasClass('bbb'));
  });
});

describe('NodeQuery.hasText', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasText());
  });
});

describe('NodeQuery.hasText with a string', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    // The text content of elements that have 4 texts and 4 elements without text
    const text = 'aaa'.repeat(4);

    measure(() => query.hasText(text));
  });
});

describe('NodeQuery.hasText with a regular expression', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasText(/^a+$/));
  });
});

describe('NodeQuery.hasNoContent', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.hasNoContent());
  });
});

describe('NodeQuery.nthChild', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.nthChild(2));
  });
});

describe('NodeQuery.nthChild of many siblings', () => {
  test('flyweight-dom', () => {
    const query = makeTestSiblingsQuery();

    // The index is in the middle, so the test is slow if siblings are counted for each element
    measure(() => query.nthChild(CHILD_COUNT / 4));
  });
});

describe('NodeQuery.firstChild', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.firstChild());
  });
});

describe('NodeQuery.onlyChild', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.onlyChild());
  });
});

describe('NodeQuery.filter', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.filter((element: { tagName: string }) => element.tagName === 'div'));
  });
});

describe('NodeQuery.filter with a query', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.filter(element => $(element).children('span')));
  });
});

describe('NodeQuery.not', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.not((element: { tagName: string }) => element.tagName === 'div'));
  });
});

describe('NodeQuery.union', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();
    const otherQuery = query.children('span');

    measure(() => query.union(otherQuery));
  });
});

describe('NodeQuery.union with a few nodes', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();
    const otherQuery = query.first().children();

    measure(() => query.union(otherQuery));
  });
});

describe('NodeQuery.at', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => query.at(-1));
  });
});

describe('NodeQuery.text', () => {
  test('flyweight-dom', () => {
    const query = $(makeTestTree(flyweightFactory)).children();

    measure(() => query.text);
  });
});

describe('NodeQuery.explode', () => {
  test('flyweight-dom', () => {
    const query = makeTestQuery();

    measure(() => {
      for (const item of query.explode()) {
        item.nodes;
      }
    });
  });
});

describe('NodeQuery.remove', () => {
  test('flyweight-dom', () => {
    const parent = makeTestParent(flyweightFactory, CHILD_COUNT);
    const query = $(parent).children();

    measure(
      {
        // Removed elements are returned to the parent before each call
        beforeIteration() {
          parent.append(...query.nodes);
        },
      },
      () => query.remove()
    );
  });
});
