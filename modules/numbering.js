import SafeList, { SafeListItem } from '../formats/safe-list';

// This will number SafeListItems consecutively
// it is called via a global event
class Numbering {
  // mask is a string containing '@' or '#' characters
  // increments value by one, expects value to be alphanumeric for '@' or numeric for '#' as last char
  constructor(quill) {
    this.quill = quill
    quill.emitter.on('safe-list-change', (source) => {
      this.recalculate()
    })
  }

  recalculate() {
    this.numbers = {}
    this.calculate(this.quill.editor.scroll)
  }

  calculate(node, state) {
    if (node.isNumbered && node.isNumbered()) {
      this.incrementNumbering(node);
    }

    (node.children || []).forEach((child) => {
      this.calculate(child)
    });
  }

  incrementNumbering(node) {
    let normalizedMask = this.removeSeparators(node.mask())
    let masks = normalizedMask.split('')
    let numbers = this.numbers[normalizedMask]

    this.numbers[normalizedMask] = this.increase(numbers, masks)
    console.log(node)
    console.log(normalizedMask)
    console.log(this.numbers[normalizedMask])
  }

  // normalizedValue = [1, 1, 'a']
  // normalizedMask = ['#', '#', '@']
  increase(normalizedValue, normalizedMask) {
    if (!normalizedValue) {
      normalizedValue = []
    }
    const lastChar = normalizedMask[normalizedMask.length - 1]
    const lastValue = normalizedValue[normalizedValue.length - 1]
    const result = normalizedValue.slice(0, normalizedValue.length - 1)
    let incrementedLastValue;

    if (lastChar === '#') {
      incrementedLastValue = (lastValue || 0) + 1
    } else if (lastChar === '@'){
      const defaultValue = this.incrementCharacter('a', -1)
      incrementedLastValue = this.incrementCharacter(lastValue || defaultValue, 1)
    } else {
      throw new Error("Error, invalid mask " + normalizedMask)
    }

    result.push(incrementedLastValue)
    return result
  }

  incrementCharacter(char, offset) {
    return String.fromCharCode(char.charCodeAt(0) + offset)
  }

  removeSeparators(str) {
    return str.replace(/[,)]/gi, '');
  }


}


export default Numbering;
