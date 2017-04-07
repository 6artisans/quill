import Parchment from 'parchment';
import Container from './container';
import Block, { BlockEmbed } from './block';
import TextBlot from './text';

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

  replace(target) {
    let item = Parchment.create(this.statics.defaultChild);
    target.moveChildren(item);
    this.appendChild(item);

    if (target.parent == null) return;
    super.replace(target)
  }

  formats() {
    return { [this.statics.blotName]: this.domNode.getAttribute('id') }
  }

}

DummyContainer.blotName = 'dummyContainer';
DummyContainer.tagName = 'dummyContainer';
DummyContainer.scope = Parchment.Scope.BLOCK_BLOT;
DummyContainer.defaultChild = 'block';
DummyContainer.allowedChildren = [Block, BlockEmbed, TextBlot];

export default DummyContainer;
