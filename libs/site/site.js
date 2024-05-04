import articleRenderer from "./article-renderer/article-renderer.js";
import codeHighlighter from "./code-highlighter/code-highlighter.js";

const CLASS_SELECTED = 'selected';
const PAGE_PARAM = 'page';
const PATH_REGEX = /^(\/[a-zA-Z0-9\-]+)*(\/[a-zA-Z0-9\-]+\.md)$/g;
const LOAD_ARTICLE_FAILED = 'Failed to retrieve the article.';

export class Site {
  #siteMetadata;
  #pageMap;

  async init(metadataUrl) {
    if (!this.#siteMetadata) {
      const response = await window.fetch(metadataUrl);

      if (response.ok) {
        this.#siteMetadata = await response.json();
        this.#pageMap = this.#createPageMap(this.#siteMetadata.pages);
        this.#initArticleLinks(this.#siteMetadata.pages);
        this.#initInitialPage(this.#siteMetadata.pages);
        console.log(`Site '${this.#siteMetadata.name}' successfully initialized.`);
      } else {
        throw new Error('Failed to load site.json.');
      }
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

  #initArticleLinks(pages) {
    const navListElem = this.#getNavListElement();

    for (let page of pages) {
      const navItemElem = this.#createNavItemElement(navListElem, page.url, page.desc);

      (function(site) {
        navItemElem.addEventListener('click', async function(e) {
          e.preventDefault();
          const path = new URL(this.href).searchParams.get(PAGE_PARAM);

          if (path) {
            await site.#loadArticle(path);
            site.#selectLinkByPath(path);
          } else {
            throw Error('No path was found!');
          }
        });
      }(this));
    }
  }

  #initInitialPage(pages) {
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

    this.#loadArticle(pagePath);
    this.#selectLinkByPath(pagePath);
  }

  async #loadArticle(path) {
    const page = this.#getPageByPath(path);

    if (page) {
      const dateTimeMs = new Date().getMilliseconds();
      const response = await window.fetch(`${path}?dateTime=${dateTimeMs}`);
      const articleElem = document.querySelector('main article');
  
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

  #getNavListElement() {
    return document.querySelector('nav ul');
  }

  #getNavLinkElements() {
    return this.#getNavListElement().querySelectorAll('a');
  }

  #createNavItemElement(navListElem, url, text) {
    const linkElem = document.createElement('a');
    linkElem.href = `/?${PAGE_PARAM}=${url}`;
    linkElem.innerText = this.#normalizeLinkText(text);
    linkElem.title = text;

    const listItemElem = document.createElement('li');
    listItemElem.appendChild(linkElem);
    navListElem.appendChild(listItemElem);

    return linkElem;
  }

  #normalizeLinkText(text) {
    if (text.length > 26) {
      return text.substr(0, 26).trim() + "...";
    }
    
    return text;
  }

  #selectLinkByPath(path) {
    const linkElems = this.#getNavLinkElements();

    for (let linkElem of linkElems) {
      if (linkElem.href.endsWith(path)) {
        linkElem.classList.add(CLASS_SELECTED);
      } else {
        linkElem.classList.remove(CLASS_SELECTED);
      }
    }
  }
}