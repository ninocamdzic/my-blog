import AbstractPageRenderer from "./abstract-page-renderer.js";

const CLASS_CODE_BLOCK = 'code-block';

export default class ShowdownPageRenderer extends AbstractPageRenderer {
  constructor() {
    super();

    if (!window.showdown) {
      throw new Error('Failed to instantiate the renderer. Showdownjs was not found.');
    }
  }

  render(data, opts) {
    const converter = new window.showdown.Converter();
    converter.setOption('tables', true);
    return this.#postProcessHtml(converter.makeHtml(data), opts);
  }

  #postProcessHtml(html, opts) {
    let result = html;
    result = result.replaceAll(/<pre.*?>/gm, `<pre class="${CLASS_CODE_BLOCK}">`);
    result = result.replaceAll(/%{date-published}%/gm, opts.page.datePublished);
    // URL rewriting for images. This makes it possible to use relative URLs in md files.
    result = result.replaceAll(/<img(.*)src="(.*?)"\s?(.*)\/?>/gm, `<img$1src="${opts.page.url}/$2"$3/>`);
    return result;
  }
}