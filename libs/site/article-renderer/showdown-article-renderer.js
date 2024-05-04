import AbstractArticleRenderer from "./abstract-article-renderer.js";

const CLASS_CODE_BLOCK = 'code-block';

export default class ShowdownArticleRenderer extends AbstractArticleRenderer {
  constructor() {
    super();

    if (!window.showdown) {
      throw new Error('Failed to instantiate the renderer. Showdownjs was not found.');
    }
  }

  render(data, opts) {
    const converter = new window.showdown.Converter();
    converter.setOption('tables', true);
    return this.#postProcHtml(converter.makeHtml(data), opts);
  }

  #postProcHtml(html, opts) {
    let result = html;
    result = result.replaceAll(/<pre.*?>/gm, `<pre class="${CLASS_CODE_BLOCK}">`);
    result = result.replaceAll(/%{date-published}%/gm, opts.page.datePublished);
    return result;
  }
}