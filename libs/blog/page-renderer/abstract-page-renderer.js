export default class AbstractPageRenderer {
  constructor() {
    if (this.constructor === AbstractPageRenderer) {
      throw new Error('Cannot instantiate AbstractArticleRenderer. The class is an abstract class.')
    }
  }

  render(data, opts) {}
}