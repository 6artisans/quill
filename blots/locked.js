import Nested from './nested';

class Locked extends Nested {

  static create(value) {
    let node = super.create(this.tagName);

    node.setAttribute('contenteditable', false)
    return node;
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
