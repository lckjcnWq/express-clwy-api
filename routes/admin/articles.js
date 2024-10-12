const express = require('express');
const router = express.Router();
const {Article} = require('../../models');
const { Op } = require('sequelize');
const { filterBody } = require('../../src/utils/BodyUtils');
const { NotFoundError } = require('../../src/bean/NotFoundError');
const { getArticle } = require('../../src/api/articleApi');
const { success,fail } = require('../../src/common/ResponseBean');
function validateIdParam(req, res, next) {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) {
        return next('route'); // 跳过当前路由，继续匹配其他路由
    }
    next();
}

//查询列表
router.get('/', async function(req, res, next) {

    try {
        const condition = {
            order: [['id', 'DESC']]
        }
        const atricles = await Article.findAll(condition)
        success(res, '查询文章列表成功', atricles)
    } catch (e) {
        fail(res, '查询文章列表失败',e.message)
    }
});
//查询文章详情
router.get('/:id', validateIdParam,async function(req, res, next) {
    try {
        const atricle = await getArticle(req)
        if(atricle){
            success(res, '查询文章成功', atricle)
        }
    } catch (e) {
        fail(res, '查询文章失败',e.message)
    }
});
//模糊查询文章详情
router.get('/search/', async function(req, res, next) {
    try {
        console.log('Request URL:', req.url);
        console.log('Request Query:', req.query);

        const query = req.query
        const condition = {
            where: {},
            order: [['id', 'DESC']]
        };

        // 添加模糊查询条件
        if (query.title) {
            condition.where.title = {
                [Op.like]: `%${query.title}%`
            };
        }

        const articles = await Article.findAll(condition)
        success(res, '模糊查询文章列表成功', articles)
    } catch (e) {
        fail(res, '模糊查询文章列表失败', e.message)
    }
});

//创建文章
router.post('/create/', async function(req, res, next) {
    try {
        const article = await Article.create(filterBody(req))
        success(res, '创建文章成功', article)
    } catch (e){
        fail(res, '创建文章失败', e.message)
    }
})

//删除指定id的文章
router.delete('/:id', async function(req, res, next) {
    try {
        const article = await getArticle(req);
        await article.destroy()
        success(res, '删除文章成功', article)
    } catch (e) {
        fail(res, '删除文件失败', e.message)
    }
});

//更新文章
router.put('/:id', async function(req, res, next) {
    try {
        const article = await getArticle(req);
        const body = filterBody(req);
        await article.update(body);
        success(res, '更新文章成功', article)
    } catch (e) {
        fail(res, '更新文件失败', e.message)
    }
});

//分页查询文章列表
router.get('/page', async function(req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 1
        const offset = (currentPage - 1) * pageSize
        const condition = {
            order: [['id', 'ASC']],
            offset:offset,
            limit: pageSize
        }
        // 如果有 title 查询参数，就添加到 where 条件中
        if (query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            };
        }
        const {count, rows} = await Article.findAndCountAll(condition)
        success(res, '分页查询成功', {
            articles: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }})
    }catch (e) {
        fail(res, '分页查询失败', e.message)
    }
})

module.exports = router;