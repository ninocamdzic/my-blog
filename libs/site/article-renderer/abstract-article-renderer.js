export default class AbstractArticleRenderer {
  constructor() {
    if (this.constructor === AbstractArticleRenderer) {
      throw new Error('Cannot instantiate AbstractArticleRenderer. The class is an abstract class.')
    }
  }

  render(data, opts) {}
}