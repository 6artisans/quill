import Nested from './nested';

class Condition extends Nested {

  create(value) {
    let node = super.create(value)

    // we get called with true on create, otherwise it is replay of delta
    if (value == true) {
      value = { id: this.randomId() }
    }

    node.setAttribute('id', value.id)
    return node
  }

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

Condition.blotName = 'condition';
Condition.tagName = 'condition';

export default Condition;
