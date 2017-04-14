import Nested from './nested';

class Condition extends Nested {

  static create(value) {
    let node = super.create(value)

    // we get called with true on create, otherwise it is replay of delta
    if (typeof value === 'string') {
      value = { name: value }
    }

    node.setAttribute('name', value.name)
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
        next.domNode.getAttribute('name') === this.domNode.getAttribute('name')) {
      next.moveChildren(this);
      next.remove();
    }
  }
}

Condition.blotName = 'condition';
Condition.tagName = 'condition';

export default Condition;
