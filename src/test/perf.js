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
        let root = new lib.Element('div', null);

        for (let i = 0; i < 5; ++i) {
          let child;
          for (let i = 0; i < 5; ++i) {
            child = root.appendChild(new lib.Element('div', null));
          }
          root = child;
        }
      });
    });

    test('domhandler', measure => {
      measure(() => {
        let root = new domhandler.Element('div', {});

        for (let i = 0; i < 5; ++i) {
          let child;
          for (let i = 0; i < 5; ++i) {
            child = new domhandler.Element('div', {});
            root.children.push(child);
          }
          root = child;
        }
      });
    });
  },
  { targetRme: 0.001, warmupIterationCount: 5 }
);
