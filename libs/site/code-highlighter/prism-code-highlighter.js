import AbstractCodeHighlighter from './abstract-code-highlighter.js';

export default class PrismCodeHighlighter extends AbstractCodeHighlighter {
  constructor() {
    super();

    if (!window.Prism) {
      throw new Error('Failed to instantiate the highlighter. Prismjs was not found.');
    }
  }

  highlight(elem) {
    window.Prism.highlightElement(elem);
  }
}