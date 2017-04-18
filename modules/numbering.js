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

  // recalculates all list numbers in the document once
  recalculate() {
    this.numbers = {}
    this.calculate(this.quill.editor.scroll)
  }

  // calculates correct numbers for a given node and his children
  calculate(node) {
    if (node.isNumbered && node.isNumbered()) {
      const nodeNumber = this.incrementNumbering(node.mask());
    }

    (node.children || []).forEach((child) => {
      this.calculate(child)
    });
  }

  // increments numbering for a given node
  incrementNumbering(nodeMask) {
    let normalizedMasks = this.removeSeparators(nodeMask).split('')
    let result = [];
    let searchIndex = [];
    let value;

    // we iterate across all levels of the number, e.g. 4 levels for 1.2.3.4
    // and we store numbers with following indices - for mask #.#.# we do:
    //    level 1: numbers[['#']] = 1
    //    level 2: numbers[[1, '#']] = 1
    //    level 3: numbers[[1, 1, '#']] = 1
    for (let i = 0; i < normalizedMasks.length; i++) {
      if (value) {
        // push previous value to the index
        searchIndex.push(value)
      }

      // we temporarily put single digit mask on the end of searchIndex
      searchIndex.push(normalizedMasks[i])

      if (i == normalizedMasks.length - 1) {
        // it is a last item which needs to be incremented

        if (this.numbers[searchIndex]) {
          // existing number - we just increment it
          value = this.incrementPosition(this.numbers[searchIndex])
        } else {
          // this number does not exist, we initialize a new one
          value = this.initializePosition(normalizedMasks[i])
        }
      } else {
        // if it does not exist, it means it is a user error and he uses 1.1.1 before 1.1,
        // so we initialize it anyways
        value = this.numbers[searchIndex] || this.initializePosition(normalizedMasks[i])
      }

      // we store the corresponding level value in numbers
      this.numbers[searchIndex] = value

      // we create complete value across all levels
      result.push(value)

      // we remove the generic mask from searchIndex
      searchIndex.pop()
    }

    return result
  }

  // initializes a new digit based on mask: 1 for # and 'a' for @
  initializePosition(maskChar) {
    if (maskChar === '#') {
      return 1
    } else if (maskChar === '@') {
      return 'a'
    } else {
      throw new Error("Error, invalid mask " + maskChar)
    }
  }

  // increments a single position, e.g.: incrementPosition(3, '#') -> 4
  incrementPosition(value) {
    if (typeof value == 'string') {
      return String.fromCharCode(value.charCodeAt(value) + 1)
    } else {
      return value + 1
    }
  }

  // removes possible separators from mask (')', '.')
  removeSeparators(str) {
    return str.replace(/[\.)]/gi, '');
  }

}


export default Numbering;
