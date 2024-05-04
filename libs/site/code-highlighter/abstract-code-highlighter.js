export default class AbstractCodeHighlighter {
  constructor() {
    if (this.constructor === AbstractCodeHighlighter) {
      throw new Error('Cannot instantiate AbstractCodeHighlighter. The class is an abstract class.')
    }
  }

  highlight(elem) {}
}