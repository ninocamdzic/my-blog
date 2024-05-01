export class Menu {
  #menuElem;
  #menuToggleElem;

  isOpen() {
    return !this.#menuElem.classList.contains(CLASS_MENU_CLOSED);
  }

  open() {
    this.#menuElem.classList.remove(CLASS_MENU_CLOSED);
    this.#menuToggleElem.classList.remove(CLASS_MENU_CLOSED)
  }

  close() {
    this.#menuElem.classList.add(CLASS_MENU_CLOSED);
    this.#menuToggleElem.classList.add(CLASS_MENU_CLOSED);
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  init() {
    this.#initElems();
    this.#initToggleElem();
    this.#initMenuItems();
    this.toggle();
  }

  #initElems() {
    this.#menuElem = document.querySelector('#menu');

    if (!this.#initElems) {
      throw new Error('Failed to locate menu element.');
    }

    this.#menuToggleElem = this.#menuElem.querySelector('.menu-toggle');

    if (!this.#menuToggleElem) {
      throw new Error('Failed to locate the menu toggle button!');
    }
  }

  #initMenuItems() {
    const menuItems = document.querySelectorAll('.menu-items a');
    
    if (!menuItems) {
      throw new Error('Failed to locate the menu items.');
    }

    (function(site) {
      for (let menuItem of menuItems) {
        menuItem.addEventListener('click', (e) => {
          site.close();
        });
      }
    }(this));
  }

  #initToggleElem() {
    this.#menuToggleElem.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
  }
}

const CLASS_MENU_CLOSED = 'closed';