import Parchment from 'parchment';
import Container from './container';
import Block, { BlockEmbed } from './block';
import TextBlot from './text';
import List from '../formats/list';

class Nested extends Container {

  static create(value) {
    let node = super.create(this.tagName);
    return node;
  }

  static compare(self, other) {
    let selfIndex = Nested.order.indexOf(self);
    let otherIndex = Nested.order.indexOf(other);
    if (selfIndex >= 0 || otherIndex >= 0) {
      return selfIndex - otherIndex;
    } else if (self === other) {
      return 0;
    } else if (self < other) {
      return -1;
    } else {
      return 1;
    }
  }

  static isNestable(name) {
    return !!Nested.order.find((x) => x == name)
  }

  // this is here just to monitor behaviour
  format(name, value) {
    return super.format(name, value)
  }

  // correct delta generation
  replace(target) {
    let item = Parchment.create(this.statics.defaultChild);
    target.moveChildren(item);
    this.appendChild(item);

    if (target.parent == null) return;
    super.replace(target)
  }

  removeContainer() {
    this.moveChildren(this.parent, this);
    this.remove();
  }

  insertBefore(blot, ref) {
    if (blot.statics.blotName == this.statics.blotName) {
      // this prevents inserting two containers recursively, instead we want them to join
      // e.g: everything we write is in the last created containers until switched off
      super.insertBefore(blot.children.head, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }

  formats() {
    // correct delta generation
    let attributes = {}
    for(let i = 0; i < this.domNode.attributes.length; i++) {
      attributes[this.domNode.attributes[i].name] = this.domNode.attributes[i].value
    }
    return { [this.statics.blotName]: attributes }
  }

  optimize() {
    super.optimize();

    if (this.parent instanceof Nested &&
        Nested.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      let parent = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(parent);
      parent.wrap(this);
    }
  }
}

Nested.blotName = 'dummy-container';
Nested.tagName = 'dummy-container';
Nested.scope = Parchment.Scope.BLOCK_BLOT;
Nested.defaultChild = 'block';
Nested.allowedChildren = [Block, BlockEmbed, TextBlot, List, Nested];
Nested.order = ['condition', 'locked']; // first is the lowest, last is the highest

export default Nested;
