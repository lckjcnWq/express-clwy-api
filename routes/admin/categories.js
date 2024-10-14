const express = require('express');
const router = express.Router();
const {Category,Course} = require('../../models');
const { Op } = require('sequelize');
const { filterCategoryBody } = require('../../src/utils/BodyUtils');
const { getCategory } = require('../../src/api/articleApi');
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
        const categorys = await Category.findAll(condition)
        success(res, '查询分类列表成功', categorys)
    } catch (e) {
        fail(res, '查询分类列表失败',e.message)
    }
});
//查询分类详情
router.get('/:id', validateIdParam,async function(req, res, next) {
    try {
        const category = await getCategory(req)
        if(category){
            success(res, '查询分类成功', category)
        }
    } catch (e) {
        fail(res, '查询分类失败',e.message)
    }
});
//模糊查询分类详情
router.get('/search/', async function(req, res, next) {
    try {
        const query = req.query
        const condition = {
            where: {},
            order: [['id', 'DESC']]
        };

        // 添加模糊查询条件
        if (query.name) {
            condition.where.name = {
                [Op.like]: `%${query.name}%`
            };
        }

        const categorys = await Category.findAll(condition)
        success(res, '模糊查询分类列表成功', categorys)
    } catch (e) {
        fail(res, '模糊查询分类列表失败', e.message)
    }
});

//创建分类
router.post('/create/', async function(req, res, next) {
    try {
        const category = await Category.create(filterCategoryBody(req))
        success(res, '创建分类成功', category)
    } catch (e){
        fail(res, '创建分类失败', e.message)
    }
})

//删除指定id的分类
router.delete('/:id', async function(req, res, next) {
    try {
        const category = await getCategory(req);

        const count = await Course.count({ where: { categoryId: req.params.id } });
        if (count > 0) {
            throw new Error('当前分类有课程，无法删除。');
        }

        await category.destroy()
        success(res, '删除分类成功', category)
    } catch (e) {
        fail(res, '删除文件失败', e.message)
    }
});

//更新分类
router.put('/:id', async function(req, res, next) {
    try {
        const category = await getCategory(req);
        const body = filterCategoryBody(req);
        await category.update(body);
        success(res, '更新分类成功', category)
    } catch (e) {
        fail(res, '更新文件失败', e.message)
    }
});

//分页查询分类列表
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
        // 如果有 name 查询参数，就添加到 where 条件中
        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            };
        }
        const {count, rows} = await Category.findAndCountAll(condition)
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