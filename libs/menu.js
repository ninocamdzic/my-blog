export class Menu {
  #menuElem;
  #menuToggleElem;
  #menuToggleIndicatorElem;

  isOpen() {
    return !this.#menuElem.classList.contains(CLASS_MENU_CLOSED);
  }

  open() {
    this.#menuElem.classList.remove(CLASS_MENU_CLOSED);
    this.#menuToggleIndicatorElem.classList.remove(CLASS_MENU_CLOSED)
  }

  close() {
    this.#menuElem.classList.add(CLASS_MENU_CLOSED);
    this.#menuToggleIndicatorElem.classList.add(CLASS_MENU_CLOSED);
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

    this.#menuToggleIndicatorElem = this.#menuToggleElem.querySelector('.indicator');

    if (!this.#menuToggleIndicatorElem) {
      throw new Error('Failed to locate the menu toggle indicator.');
    }
  }

  #initMenuItems() {
    const menuItems = document.querySelectorAll('.menu-items a');
    
    if (!menuItems) {
      throw new Error('Failed to locate the menu items.');
    }

    (function(menu) {
      for (let menuItem of menuItems) {
        menuItem.addEventListener('click', (e) => {
          menu.close();
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