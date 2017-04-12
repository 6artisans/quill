import Parchment from 'parchment';
import Container from './container';
import Block, { BlockEmbed } from './block';
import TextBlot from './text';
import List from '../formats/list';

class DummyContainer extends Container {
  static randomId() {
    return Math.random().toString(36).slice(2);
  }

  static create(value) {
    let node = super.create(this.tagName);

    if (value == true) {
      value = { id: this.randomId() }
    }

    node.setAttribute('id', value.id)
    return node;
  }

  // this is here just to monitor behaviour
  format(name, value) {
    return super.format(name, value)
  }

  isNestable(name) {
    return name == 'dummyContainer'
  }

  formatAt(index, length, name, value) {
    if (this.isNestable(name)) {
      // this prevents dummyContainer from nested containers behaviour (list)
      return
    } else {
      return super.formatAt(index, length, name, value)
    }
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
    return { [this.statics.blotName]: { id: this.domNode.getAttribute('id') } }
  }

}

DummyContainer.blotName = 'dummy-container';
DummyContainer.tagName = 'dummy-container';
DummyContainer.scope = Parchment.Scope.BLOCK_BLOT;
DummyContainer.defaultChild = 'block';
DummyContainer.allowedChildren = [Block, BlockEmbed, TextBlot, List, DummyContainer];

export default DummyContainer;
