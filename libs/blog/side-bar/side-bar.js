const CLASS_CLOSED = 'closed';
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
    return this.#sideBarToggleElem.contains(CLASS_CLOSED);
  }

  open() {
    this.#sideBarToggleElem.add(CLASS_CLOSED);
  }

  close() {
    this.#sideBarToggleElem.remove(CLASS_CLOSED);
  }

  init() {
    this.#initSideBar();
    this.#initArticleLinks();
  }

  #initSideBar() {
    this.#sideBarElem = document.querySelector("#side-bar");
    this.#sideBarToggleElem = this.#sideBarElem.querySelector('.toggle');

    this.#sideBarToggleElem.addEventListener('click', function(e) {
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
          sideBar.#selectItemByUrl(this.href);
        });
      }(this));

      li.appendChild(a);
      ul.appendChild(li);
    }

    this.#navMenuElem.appendChild(ul);
  }

  #selectItemByUrl(url) {
    const linkElems = this.#navMenuElem.querySelectorAll('a');

    for (let linkElem of linkElems) {
      if (linkElem.href !== url) {
        linkElem.classList.remove(CLASS_SELECTED);
      } else {
        linkElem.classList.add(CLASS_SELECTED);
      }
    }
  }
}