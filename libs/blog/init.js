import Blog from './blog.js';
import SideBar from './side-bar/side-bar.js';

async function init() {
  const blog = new Blog('../blog.json');
  await blog.init();

  const sideBar = new SideBar(blog);
  sideBar.init();
}

window.addEventListener('DOMContentLoaded', async function(e) {
  init();
});