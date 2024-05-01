const CLASS_SELECTED = 'selected';
const PAGE_PARAM = 'page';
const PATH_REGEX = /^(\/[a-zA-Z0-9\-]+)*(\/[a-zA-Z0-9\-]+\.md)$/g;

export class Site {
  async init(dataUrl) {
    const response = await window.fetch(dataUrl);

    if (response.ok) {
      const site = await response.json();
      this.#initArticles(site.pages);
      this.#initInitialPage(site.pages);
    } else {
      throw new Error('Failed to load site.json.');
    }
  }

  #initArticles(navItems) {
    const navListElem = this.#getNavListElement();

    for (let navItem of navItems) {
      const navItemElem = this.#createNavItemElement(navListElem, navItem.url, navItem.desc);

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
    const dateTimeMs = new Date().getMilliseconds();
    const response = await window.fetch(`${path}?dateTime=${dateTimeMs}`);
    const articleElem = document.querySelector('main article');

    if (response.ok) {
      window.history.pushState('', '', `/?${PAGE_PARAM}=${path}`);

      const text = await response.text();
      articleElem.innerHTML = this.#toHtml(text);

      // TODO Make plugin.
      if (Prism) {
        const codeElems = document.querySelectorAll('code');

        for (let codeElem of codeElems) {
          Prism.highlightElement(codeElem);
        }
      }
    } else {
      articleElem.innerHTML = 'Failed to retrieve the article.';
    }
  }

  #toHtml(text) {
    const converter = new showdown.Converter();
    converter.setOption('tables', true);
    return converter.makeHtml(text);
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