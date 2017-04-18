import Parchment from 'parchment';
import Block from '../blots/block';
import Container from '../blots/container';
import List, { ListItem } from './list';
import Emitter from '../core/emitter'

// This is a list with safe numbering
// breaking this is in half does not break the numbering
class SafeListItem extends ListItem {
  static formats(domNode) {
    return domNode.tagName === this.tagName ? undefined : super.formats(domNode);
  }

  // fire a safe list change event, so we can compute numbers of items
  attach() {
    super.attach()
    quill.emitter.emit(Emitter.events.SAFE_LIST_CHANGE)
  }

  detach() {
    super.detach()
    quill.emitter.emit(Emitter.events.SAFE_LIST_CHANGE)
  }

  // this means the element is numbered and increments numbering by one
  isNumbered() {
    return true
  }

  mask() {
    return '@.@.@'
  }
}

SafeListItem.blotName = 'safe-list-item';
SafeListItem.tagName = 'safelistitem';


class SafeList extends List {
  static create(value) {
    let node = super.create(SafeList.tagName);
    if (value === 'checked' || value === 'unchecked') {
      node.setAttribute('data-checked', value === 'checked');
    }
    node.setAttribute('mask', '#.#.@')
    return node;
  }

  static formats(domNode) {
    return 'ordered';
  }
}
SafeList.blotName = 'safe-list';
SafeList.scope = Parchment.Scope.BLOCK_BLOT;
SafeList.tagName = 'safelist';
SafeList.defaultChild = 'safe-list-item';
SafeList.allowedChildren = [SafeListItem];


export { SafeListItem, SafeList as default };
