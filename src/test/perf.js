const domhandler = require('domhandler');
const lib = require('../../lib');

describe('Element.appendChild', () => {
  beforeBatch(() => {
    gc();
  });

  test('lib', measure => {
    measure(() => {
      const root = new lib.Element('div');

      root.appendChild(new lib.Element('div'));
      root.appendChild(new lib.Element('div'));
      root.appendChild(new lib.Element('div'));
    });
  });

  test('domhandler', measure => {
    measure(() => {
      const root = new domhandler.Element('div', {});

      root.children.push(new domhandler.Element('div', {}));
      root.children.push(new domhandler.Element('div', {}));
      root.children.push(new domhandler.Element('div', {}));
    });
  });
});

describe('Element.append', () => {
  beforeBatch(() => {
    gc();
  });

  test('lib', measure => {
    measure(() => {
      const root = new lib.Element('div');

      root.append(new lib.Element('div'), new lib.Element('div'), new lib.Element('div'));
    });
  });

  test('domhandler', measure => {
    measure(() => {
      const root = new domhandler.Element('div', {});

      root.children.push(new domhandler.Element('div', {}));
      root.children.push(new domhandler.Element('div', {}));
      root.children.push(new domhandler.Element('div', {}));
    });
  });
});

describe('Element.childNodes', () => {
  beforeBatch(() => {
    gc();
  });

  test('lib', measure => {
    const root = new lib.Element('div');

    root.append(new lib.Element('div'), new lib.Element('div'), new lib.Element('div'));

    measure(() => {
      root.childNodes.length;
    });
  });
});

describe('Element.classList', () => {
  beforeBatch(() => {
    gc();
  });

  test('add', measure => {
    let element;

    beforeIteration(() => {
      element = new lib.Element('div');
    });

    measure(() => {
      element.classList.add('aaa', 'bbb');
    });
  });
});

describe('TreeWalker.nextNode()', () => {
  /*
   * <document>
   *   <element1>
   *     <element2>
   *       #text1
   *     </element2>
   *   </element1>
   *   <element3>
   *     #text2
   *   </element3>
   *   <element4/>
   * </document>
   */
  const document = new lib.Document();
  const element1 = new lib.Element('element1');
  const element2 = new lib.Element('element2');
  const element3 = new lib.Element('element3');
  const element4 = new lib.Element('element4');
  const text1 = new lib.Text('text1');
  const text2 = new lib.Text('text2');

  document.append(element1.append(element2.append(text1)), element3.append(text2), element4);

  test('firstChild', measure => {
    const treeWalker = new lib.TreeWalker(document);

    beforeIteration(() => {
      treeWalker.currentNode = document;
    });

    measure(() => {
      treeWalker.nextNode();
    });
  });

  test('filter', measure => {
    const treeWalker = new lib.TreeWalker(document, undefined, node => (node.nodeType !== 3 ? 3 : 1));

    beforeIteration(() => {
      treeWalker.currentNode = text1;
    });

    measure(() => {
      treeWalker.nextNode();
    });
  });
});
