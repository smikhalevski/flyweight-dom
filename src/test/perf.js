const domhandler = require('domhandler');
const lib = require('../../lib/index-cjs');

describe(
  'Element.appendChild',
  () => {
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
  },
  { targetRme: 0.001, warmupIterationCount: 5 }
);

describe(
  'Element.append',
  () => {
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
  },
  { targetRme: 0.001, warmupIterationCount: 5 }
);

describe(
  'Element.classList.add',
  () => {
    beforeBatch(() => {
      gc();
    });

    test('lib', measure => {
      let element;

      beforeIteration(() => {
        element = new lib.Element('div');
      });

      measure(() => {
        element.classList.add('aaa', 'bbb');
      });
    });
  },
  { targetRme: 0.001, warmupIterationCount: 5 }
);
