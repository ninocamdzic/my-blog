const COMPONENT_NAME = 'nav-menu';
const CLASS_MENU_CLOSED = 'closed';
const CLASS_SELECTED = 'selected';

customElements.define(COMPONENT_NAME, class extends HTMLElement {
  #linkElems = [];
  navItemClickEvent = new CustomEvent('navItemClick', {
    bubbles: true,
    cancelable: true,
    detail: 'This is awesome. I could also be an object or array.'
  });

  constructor() {
    super();
  }

  init(items) {
    this.#initElems(items);
  }

  selectItemByHref(selectedHref) {
    for (let linkElem of this.#linkElems) {
      if (linkElem.href !== selectedHref) {
        linkElem.classList.remove(CLASS_SELECTED);
      } else {
        linkElem.classList.add(CLASS_SELECTED);
      }
    }
  }

  #initElems(items) {
    const nav = document.createElement('nav');
    const ul = document.createElement('ul');

    for (let navItem of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.href = `/?page=${navItem.url}`;
      a.innerText = navItem.desc;
      a.title = navItem.desc;

      (function(component) {
        a.addEventListener('click', function(e) {
          e.preventDefault();
          component.#emitEvent('click', this.href);
          component.selectItemByHref(this.href);
        });
      }(this));

      this.#linkElems.push(a);
      li.appendChild(a);
      ul.appendChild(li);
    }

    nav.appendChild(ul);
    this.appendChild(nav);
  }

  #emitEvent(name, data) {
    let event = new CustomEvent(`${COMPONENT_NAME}.${name}`, {
      bubbles: true,
      cancelable: true,
      detail: data
    });

    return this.dispatchEvent(event);
  }
});