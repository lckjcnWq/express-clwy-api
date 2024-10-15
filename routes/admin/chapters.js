const express = require('express');
const router = express.Router();
const {Chapter,Course} = require('../../models');
const { Op } = require('sequelize');
const { filterChapterBody } = require('../../src/utils/BodyUtils');
const { getChapter,getChapterCondition } = require('../../src/api/articleApi');
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
        const atricles = await Chapter.findAll(condition)
        success(res, '查询章节列表成功', atricles)
    } catch (e) {
        fail(res, '查询章节列表失败',e.message)
    }
});
//查询章节详情
router.get('/:id', validateIdParam,async function(req, res, next) {
    try {
        const atricle = await getChapter(req)
        if(atricle){
            success(res, '查询章节成功', atricle)
        }
    } catch (e) {
        fail(res, '查询章节失败',e.message)
    }
});
//模糊查询章节详情
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

        const chapters = await Chapter.findAll(condition)
        success(res, '模糊查询章节列表成功', chapters)
    } catch (e) {
        fail(res, '模糊查询章节列表失败', e.message)
    }
});

//创建章节
router.post('/create/', async function(req, res, next) {
    try {
        const article = await Chapter.create(filterChapterBody(req))
        await Course.increment('chaptersCount', { where: { id: chapter.courseId }});
        success(res, '创建章节成功', article)
    } catch (e){
        fail(res, '创建章节失败', e.message)
    }
})

//删除指定id的章节
router.delete('/:id', async function(req, res, next) {
    try {
        const chapter = await getChapter(req);
        await chapter.destroy()
        await Course.decrement('chaptersCount', { where: { id: chapter.courseId }});
        success(res, '删除章节成功', chapter)
    } catch (e) {
        fail(res, '删除文件失败', e.message)
    }
});

//更新章节
router.put('/:id', async function(req, res, next) {
    try {
        const chapter = await getChapter(req);
        const body = filterChapterBody(req);
        await chapter.update(body);
        success(res, '更新章节成功', chapter)
    } catch (e) {
        fail(res, '更新文件失败', e.message)
    }
});

//分页查询章节列表
router.get('/page', async function(req, res, next) {
    try {
        const query = req.query
        if (!query.courseId) {
            throw new Error('获取章节列表失败，课程ID不能为空。');
        }
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 1
        const offset = (currentPage - 1) * pageSize
        const condition = {
            ...getChapterCondition(),
            where: {},
            order: [['rank', 'ASC'], ['id', 'ASC']],
            offset:offset,
            limit: pageSize
        }
        condition.where.courseId = query.courseId;

        if (query.title) {
            condition.where.title = {
                [Op.like]: `%${ query.title }%`
            };
        }
        const {count, rows} = await Chapter.findAndCountAll(condition)
        success(res, '分页查询成功', {
            chapters: rows,
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