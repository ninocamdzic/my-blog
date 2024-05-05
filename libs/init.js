import { Site } from './site/site.js';

window.addEventListener('DOMContentLoaded', async function(e) {
  init();
});

async function init() {
  const site = await Site.init('/site.json');
  initMenu(site);
}

function initMenu(site) {
  const menu = document.querySelector('nav-menu');
  menu.init(site.siteMetadata.pages);
  menu.addEventListener('nav-menu.click', function(e) {
    site.showArticle(e.detail);
  });
  menu.selectItemByHref(`${window.location.origin}/?page=${site.initialPagePath}`);
}