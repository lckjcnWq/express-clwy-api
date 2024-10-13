const {Article,Category} = require('../../models');
const { NotFoundError } = require('../../src/bean/NotFoundError');

async function getArticle(req) {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
        throw new NotFoundError(`ID: ${ id }的文章未找到。`)
    }

    return article;
}
async function getCategory(req) {
    const { id } = req.params;
    const article = await Category.findByPk(id);
    if (!article) {
        throw new NotFoundError(`ID: ${ id }的文章未找到。`)
    }

    return article;
}

module.exports = {
    getArticle,
    getCategory
}