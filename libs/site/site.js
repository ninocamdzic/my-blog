import articleRenderer from "./article-renderer/article-renderer.js";
import codeHighlighter from "./code-highlighter/code-highlighter.js";

const PAGE_PARAM = 'page';
const PATH_REGEX = /^(\/[a-zA-Z0-9\-]+)*(\/[a-zA-Z0-9\-]+\.md)$/g;
const LOAD_ARTICLE_FAILED = 'Failed to retrieve the article.';

export class Site {
  #siteMetadata;
  #pageMap;
  #initialPagePath;

  constructor() {}

  static async init(siteMetadataUrl) {
    let site;

    if (siteMetadataUrl) {
      site = new Site();
      const response = await window.fetch(siteMetadataUrl);

      if (response.ok) {
        site.#siteMetadata = await response.json();
        site.#pageMap = site.#createPageMap(site.#siteMetadata.pages);
        site.#initialPagePath = await site.#initInitialPage(site.#siteMetadata.pages);
      } else {
        throw new Error('Failed to load site.json.');
      }
    }

    return site;
  }

  get siteMetadata() {
    return this.#siteMetadata;
  }

  get initialPagePath() {
    return this.#initialPagePath;
  }

  async showArticle(url) {
    const path = new URL(url).searchParams.get(PAGE_PARAM);

    if (path) {
      await this.#loadArticle(path);
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

    await  this.#loadArticle(pagePath);
    return pagePath;
  }

  async #loadArticle(path) {
    const page = this.#getPageByPath(path);
    const articleElem = document.querySelector('main article');

    if (page) {
      const dateTimeMs = new Date().getMilliseconds();
      const response = await window.fetch(`${path}?dateTime=${dateTimeMs}`);
      
      if (response.ok) {
        window.history.pushState('', '', `/?${PAGE_PARAM}=${path}`);
  
        const text = await response.text();
        articleElem.innerHTML = articleRenderer.render(text, { 
          page: page
        });
        this.#highlightCodeBlocks();
      } else {
        articleElem.innerHTML = LOAD_ARTICLE_FAILED;
      }
    } else {
      articleElem.innerHTML = LOAD_ARTICLE_FAILED;
    }
  }

  #highlightCodeBlocks() {
    const codeElems = document.querySelectorAll('code');

    for (let codeElem of codeElems) {
      codeHighlighter.highlight(codeElem);
    }
  }
}