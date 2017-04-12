import Nested from './nested';

class Locked extends Nested {

  optimize() {
    super.optimize();

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
}

Locked.blotName = 'locked';
Locked.tagName = 'locked';

export default Locked;
