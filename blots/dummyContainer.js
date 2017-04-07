import Parchment from 'parchment';
import Container from './container';
import Block, { BlockEmbed } from './block';
import TextBlot from './text';

class DummyContainer extends Block {
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

  insertBefore(blot, ref) {
    super.insertBefore(blot, ref);
    console.log(blot, ref);
  }
  insertAt(index, value, def) {
    super.insertAt(index, value, def);
    console.log(index, value, def);
  }

  optimize() {
    console.log('optimize');
    return super.optimize();
  }
  formats() {
    console.log('formats');
    return super.formats();
  }

}

DummyContainer.blotName = 'dummyContainer';
DummyContainer.tagName = 'dummyContainer';
DummyContainer.scope = Parchment.Scope.BLOCK_BLOT;
DummyContainer.defaultChild = 'block';
DummyContainer.allowedChildren = [Block, BlockEmbed, TextBlot];

export default DummyContainer;
