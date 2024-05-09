import pageRenderer from "./page-renderer/page-renderer.js";
import codeHighlighter from "./code-highlighter/code-highlighter.js";

const PAGE_PARAM = 'page';
const PATH_REGEX = /^(\/[a-zA-Z0-9\-]+)+$/g;
const LOAD_PAGE_FAILED = 'Failed to retrieve the page.';

export default class Blog {
  #metadataUrl;
  #metadata;
  #pageMap;
  #initialPagePath;

  constructor(metadataUrl) {
    if (metadataUrl) {
      this.#metadataUrl = metadataUrl;
    } else {
      throw Error('No metadata URL was specified.');
    }
  }

  async init() {
    const response = await window.fetch(this.#metadataUrl);

    if (response.ok) {
      this.#metadata = await response.json();
      this.#pageMap = this.#createPageMap(this.#metadata.pages);
      this.#initialPagePath = await this.#initInitialPage(this.#metadata.pages);
    } else {
      throw Error('Failed to load blog.json.');
    }
  }

  get metadata() {
    return this.#metadata;
  }

  get initialPagePath() {
    return this.#initialPagePath;
  }

  async showPage(url) {
    const path = new URL(url).searchParams.get(PAGE_PARAM);

    if (path) {
      await this.#loadPage(path);
    } else {
      throw Error('No path was found!');
    }
  }

  #createPageMap(pages) {
    const result = [];

    for (let page of pages) {
      result[page.url] = page;
    }

    return result;
  }

  #getPageByPath(path) {
    return this.#pageMap[path];
  }

  async #initInitialPage(pages) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    let pagePath = params.get(PAGE_PARAM);

    if (pagePath && !PATH_REGEX.test(pagePath)) {
      pagePath = undefined;
    }

    if (!pagePath) {
      for (let page of pages) {
        if (page.default) {
          pagePath = page.url;
          break;
        }
      }
    }

    await  this.#loadPage(pagePath);
    return pagePath;
  }

  async #loadPage(path) {
    const page = this.#getPageByPath(path);
    const articleElem = document.querySelector('main article');

    if (page) {
      const dateTimeMs = new Date().getMilliseconds();
      const response = await window.fetch(`${path}/index.md?dateTime=${dateTimeMs}`);
      
      if (response.ok) {
        window.history.pushState('', '', `/?${PAGE_PARAM}=${path}`);
  
        const text = await response.text();
        articleElem.innerHTML = pageRenderer.render(text, { 
          page: page
        });
        this.#highlightCodeBlocks();
      } else {
        articleElem.innerHTML = LOAD_PAGE_FAILED;
      }
    } else {
      articleElem.innerHTML = LOAD_PAGE_FAILED;
    }
  }

  #highlightCodeBlocks() {
    const codeElems = document.querySelectorAll('code');

    for (let codeElem of codeElems) {
      codeHighlighter.highlight(codeElem);
    }
  }
}