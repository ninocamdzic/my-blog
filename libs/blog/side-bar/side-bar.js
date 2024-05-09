const CLASS_OPEN = 'open';
const CLASS_SELECTED = 'selected';

export default class SideBar {
  #blog;
  #sideBarElem;
  #sideBarToggleElem;
  #navMenuElem;
  

  constructor(blog) {
    this.#blog = blog;
  }

  isOpen() {
    return this.#sideBarElem.classList.contains(CLASS_OPEN);
  }

  open() {
    this.#sideBarElem.classList.add(CLASS_OPEN);
  }

  close() {
    this.#sideBarElem.classList.remove(CLASS_OPEN);
  }

  init() {
    this.#initSideBar();
    this.#initArticleLinks();
  }

  #initSideBar() {
    this.#sideBarElem = document.querySelector("#side-bar");
    this.#sideBarToggleElem = this.#sideBarElem.querySelector('.toggle');

    this.#sideBarToggleElem.addEventListener('click', (e) => {
      if (this.isOpen()) {
        this.close();
      } else {
        this.open();
      }
    });
  }

  #initArticleLinks() {
    this.#navMenuElem = this.#sideBarElem.querySelector('nav');
    const ul = document.createElement('ul');

    for (let navItem of this.#blog.metadata.pages) {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.href = `/?page=${navItem.url}`;
      a.innerText = navItem.desc;
      a.title = navItem.desc;

      (function(sideBar) {
        a.addEventListener('click', function(e) {
          e.preventDefault();
          sideBar.#blog.showArticle(this.href);
          sideBar.#selectItemByPath(this.href);
          sideBar.close();
        });
      }(this));

      li.appendChild(a);
      ul.appendChild(li);
    }

    this.#navMenuElem.appendChild(ul);
    this.#selectItemByPath(this.#blog.initialPagePath);
  }

  #selectItemByPath(path) {
    const linkElems = this.#navMenuElem.querySelectorAll('a');

    for (let linkElem of linkElems) {
      if (!linkElem.href.endsWith(path)) {
        linkElem.classList.remove(CLASS_SELECTED);
      } else {
        linkElem.classList.add(CLASS_SELECTED);
      }
    }
  }
}