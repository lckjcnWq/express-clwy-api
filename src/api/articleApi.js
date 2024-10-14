const {Article,Category,Setting,User,Course} = require('../../models');
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

async function getUser(req) {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError('初始系统用户未找到，请运行种子文件。')
    }

    return user;
}

async function getCourse(req) {
    const { id } = req.params;
    const condition = {
        attributes: { exclude: ['categoryId', 'userId'] },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'avatar']
            }
        ]
    }
    const course = await Course.findByPk(id,condition);
    if (!course) {
        throw new NotFoundError('初始系统课程未找到，请运行种子文件。')
    }

    return course;
}

module.exports = {
    getArticle,
    getCategory,
    getSetting,
    getUser,
    getCourse
}