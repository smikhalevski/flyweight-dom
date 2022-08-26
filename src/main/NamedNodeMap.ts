import { die } from './utils';
import { Attr } from './Attr';
import { Mutable } from './node-utils';
import { Element } from './Element';

export interface NamedNodeMap {
  getNamedItem(name: string): Attr | null;

  setNamedItem(attr: Attr): Attr | null;

  removeNamedItem(name: string): Attr;

  item(index: number): Attr | null;

  [index: number]: Attr;
}

export class NamedNodeMap {
  readonly length = 0;

  constructor(readonly ownerElement: Element) {}
}

const prototype = NamedNodeMap.prototype;

prototype.getNamedItem = function (name) {
  for (let i = 0; i < this.length; ++i) {
    const thisAttr = this[i];

    if (thisAttr.name === name) {
      return thisAttr;
    }
  }
  return null;
};

// prototype.setNamedItem = function (this: Mutable<NamedNodeMap>, attr: Mutable<Attr>) {
//   const thisOwnerElement = this.ownerElement;
//
//   const { ownerElement, name } = attr;
//
//   if (ownerElement === thisOwnerElement) {
//     return attr;
//   }
//   if (ownerElement) {
//     die('The attribute provided is already an attribute of another element');
//   }
//
//   for (let i = 0; i < this.length; ++i) {
//     const thisAttr: Mutable<Attr> = this[i];
//
//     if (thisAttr.name !== name) {
//       continue;
//     }
//
//     this[i] = attr;
//
//     attr.ownerElement = thisOwnerElement;
//     thisAttr.ownerElement = null;
//
//     thisOwnerElement.rawAttributes[name] = attr.value;
//
//     return thisAttr;
//   }
//   this[this.length++] = attr;
//
//   return null;
// };
//
// prototype.removeNamedItem = function (this: Mutable<NamedNodeMap>, name) {
//   for (let i = 0; i < this.length; ++i) {
//     const thisAttr: Mutable<Attr> = this[i];
//
//     if (thisAttr.name !== name) {
//       continue;
//     }
//
//     for (let j = i; j < this.length - 1; ++j) {
//       this[j] = this[j + 1];
//     }
//
//     thisAttr.ownerElement = null;
//
//     delete this[this.length--];
//     delete this.ownerElement.rawAttributes[name];
//
//     return thisAttr;
//   }
//   die('No item with name "' + name + '" was found');
// };
//
// prototype.item = function (index) {
//   return this[index] || null;
// };
