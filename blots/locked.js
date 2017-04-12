import DummyContainer from './dummy-container';

class Locked extends DummyContainer {

  static create(value) {
    let node = super.create(this.tagName);
    return node;
  }

  formats() {
    // correct delta generation
    return { [this.statics.blotName]: true }
  }

  optimize() {
    super.optimize();

    // merge two consecutive containers
    // by our definition, there must be a divider between containers
    let next = this.next;
    if (next != null && next.prev === this &&
        next.statics.blotName === this.statics.blotName &&
        next.domNode.tagName === this.domNode.tagName) {
      next.moveChildren(this);
      next.remove();
    }
  }
}

Locked.blotName = 'locked';
Locked.tagName = 'locked';

export default Locked;
