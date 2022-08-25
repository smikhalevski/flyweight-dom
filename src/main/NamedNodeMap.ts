import { die } from './utils';
import { Attr } from './Attr';
import { Mutable } from './node-utils';

export interface NamedNodeMap {
  getNamedItem(name: string): Attr | null;

  item(index: number): Attr | null;

  removeNamedItem(name: string): Attr;

  setNamedItem(attr: Attr): Attr | null;

  readonly [index: number]: Attr;
}

export class NamedNodeMap {
  readonly length = 0;

  constructor(rawAttributes: { [name: string]: string }) {}
}

const prototype = NamedNodeMap.prototype;

prototype.getNamedItem = function (name) {
  for (let i = 0; i < this.length; ++i) {
    const attr = this[i];

    if (attr.name === name) {
      return attr;
    }
  }
  return null;
};

prototype.item = function (index) {
  return this[index] || null;
};

prototype.removeNamedItem = function (this: Mutable<NamedNodeMap>, name) {
  for (let i = 0; i < this.length; ++i) {
    const { name } = this[i];

    if (name !== name) {
      continue;
    }

    for (let j = i; j < this.length - 1; ++j) {
      this[j] = this[j + 1];
    }

    delete this[this.length--];
  }

  die("No item with name '" + name + "' was found");
};

prototype.setNamedItem = function (attr) {
  // if (attr.ownerElement) {
  //   die('In use');
  // }
  //
  // if (this[attr.name])
  //
  // for (let i = 0; i < this.length; ++i) {
  //   const a = this[i];
  //
  //   if (a.name === a.) {
  //     return a;
  //   }
  // }
  return null;
};
