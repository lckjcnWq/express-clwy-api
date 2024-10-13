const {Article,Category,Setting} = require('../../models');
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
    const category = await Category.findByPk(id);
    if (!category) {
        throw new NotFoundError(`ID: ${ id }的分类未找到。`)
    }

    return category;
}

async function getSetting(req) {
    const setting = await Setting.findOne();
    if (!setting) {
        console.log('setting', '初始系统设置未找到，请运行种子文件')
        throw new NotFoundError('初始系统设置未找到，请运行种子文件。')
    }

    return setting;
}

module.exports = {
    getArticle,
    getCategory,
    getSetting
}