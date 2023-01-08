import { extendClass } from '../main/utils';

describe('extendClass', () => {
  test('extends class prototype', () => {
    class Subclass {}

    class Superclass {}

    extendClass(Subclass, Superclass);

    expect(new Subclass()).toBeInstanceOf(Subclass);
    expect(new Subclass()).toBeInstanceOf(Superclass);
    expect(new Subclass().constructor).toBe(Subclass);
  });

  test('copies superclass statics to subclass', () => {
    class Subclass {}

    class Superclass {
      static AAA = 111;
    }

    extendClass(Subclass, Superclass);

    expect((Subclass as any).AAA).toBe(111);
  });

  test('does not overwrite statics of the subclass with values from superclass', () => {
    class Subclass {
      static AAA = 111;
    }

    class Superclass {
      static AAA = 222;
      static BBB = 333;
    }

    extendClass(Subclass, Superclass);

    expect((Superclass as any).AAA).toBe(222);
    expect((Subclass as any).AAA).toBe(111);
    expect((Subclass as any).BBB).toBe(333);
  });

  test('defines properties of the prototype', () => {
    class Subclass {}

    class Superclass {}

    extendClass(Subclass, Superclass, { AAA: { value: 111 } });

    expect(new Superclass().hasOwnProperty('AAA')).toBe(false);
    expect(new Subclass().hasOwnProperty('AAA')).toBe(false);
    expect(Subclass.prototype.hasOwnProperty('AAA')).toBe(true);
  });
});
