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
        let root = new lib.Element('div');

        for (let i = 0; i < 10; ++i) {
          root = root.appendChild(new lib.Element('div'));
        }
      });
    });

    test('domhandler', measure => {
      measure(() => {
        let root = new domhandler.Element('div', {}, []);

        for (let i = 0; i < 10; ++i) {
          const child = new domhandler.Element('div', {});
          root.children.push(child);
          root = child;
        }
      });
    });
  },
  { targetRme: 0.001 }
);
