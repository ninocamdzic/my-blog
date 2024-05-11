import pageRenderer from "./page-renderer/page-renderer.js";
import codeHighlighter from "./code-highlighter/code-highlighter.js";

const PAGE_PARAM = 'page';
const PATH_REGEX = /^(\/[a-zA-Z0-9\-]+)+$/g;
const LOAD_PAGE_FAILED = 'Failed to retrieve the page.';
const CLASS_CLOSED = 'closed';

export default class Blog {
  #baseUrl;
  #articleElem;
  #loaderElem;
  #metadataUrl;
  #options;
  #metadata;
  #pageMap;
  #initialPagePath;

  constructor(metadataUrl, options) {
    if (metadataUrl) {
      this.#metadataUrl = metadataUrl;
      this.#options = options || {};
      console.log(this.#options);
    } else {
      throw Error('No metadata URL was specified.');
    }
  }

  async init() {
    this.#initBaseUrl();
    this.#initElements();

    const response = await window.fetch(`${this.#baseUrl}/${this.#metadataUrl}`);

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

  #initBaseUrl() {
    this.#baseUrl = location.pathname;
    const baseElem = document.querySelector('base');

    if (baseElem) {
      this.#baseUrl = baseElem.href;
    }
  }

  #initElements() {
    this.#articleElem = document.querySelector('main article');
    this.#loaderElem = document.querySelector('.page-loader');
  }

  #showLoader() {
    if (this.#loaderElem) {
      this.#loaderElem.classList.remove(CLASS_CLOSED);
    }
  }

  #closeLoader() {
    if (this.#loaderElem) {
      this.#loaderElem.classList.add(CLASS_CLOSED);
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

    if (page) {
      this.#showLoader();

      this.#articleElem.innerHTML = '';

      const response = await window.fetch(`${this.#baseUrl}/${path}/index.md`);
      
      if (response.ok) {
        window.history.pushState('', '', `${this.#baseUrl}?${PAGE_PARAM}=${path}`);
  
        const text = await response.text();
        this.#articleElem.innerHTML = pageRenderer.render(text, { 
          page: page
        });
        this.#highlightCodeBlocks();
        this.#closeLoader();
      } else {
        this.#articleElem.innerHTML = LOAD_PAGE_FAILED;
      }
    } else {
      this.#articleElem.innerHTML = LOAD_PAGE_FAILED;
    }
  }

  #highlightCodeBlocks() {
    const codeElems = document.querySelectorAll('code');

    for (let codeElem of codeElems) {
      codeHighlighter.highlight(codeElem);
    }
  }
}