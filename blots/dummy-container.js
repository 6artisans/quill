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
    let tagName = 'dummyContainer';
    let node = super.create(tagName);
    if (value == true) {
      value = this.randomId();
    }
    node.setAttribute('id', value);
    return node;
  }

  // this is here just to monitor behaviour
  format(name, value) {
    console.log('name: ' + name + ' value: ' + value);
    return super.format(name, value)
  }

  formatAt(index, length, name, value) {
    console.log("formatAt ", index, length, name, value)
    if (name == 'dummyContainer') {
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
    return { [this.statics.blotName]: this.domNode.getAttribute('id') }
  }

  optimize() {
    super.optimize();


    // // merge with my parent if I am a nested dummyContainer
    // // does not seem neccessary at the moment
    // let parent = this.parent;
    // if (parent != null && parent.statics.blotName == 'dummyContainer') {
    //   // we will mark td position, put in table and replace mark
    //   this.moveChildren(parent)
    //   this.remove()
    // }

    // merge two consecutive containers
    // by our definition, there must be a divider between containers
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName &&
        // we merge only containers with the same id (not used yet)
        next.domNode.getAttribute('id') === this.domNode.getAttribute('id')) {
      next.moveChildren(this);
      next.remove();
    }
  }

  // deleteAt(index, length) {
  //   console.log("deleteAt")
  //   return super.deleteAt(index, length);
  // }
  //
  // removeChild(child) {
  //   console.log("removeChild")
  //   return super.removeChild(child);
  // }
  // replaceWith(name, value) {
  //   console.log("replaceWith")
  //   return super.replaceWith(name, value);
  // }
  //
  // remove() {
  //   console.log("remove")
  //   return super.remove();
  // }
  //
  // detach() {
  //   console.log("detach")
  //   return super.detach()
  // }
}

DummyContainer.blotName = 'dummy-container';
DummyContainer.tagName = 'dummy-container';
DummyContainer.scope = Parchment.Scope.BLOCK_BLOT;
DummyContainer.defaultChild = 'block';
DummyContainer.allowedChildren = [Block, BlockEmbed, TextBlot, List];

export default DummyContainer;
