import { Site } from './site.js';
import { Menu } from './menu.js';

window.addEventListener('DOMContentLoaded', async function(e) {
  await new Site().init('/site.json');
  new Menu().init();
});