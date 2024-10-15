const express = require('express');
const router = express.Router();
const {Course, Category, User,Chapter } = require('../../models');
const { Op } = require('sequelize');
const { filterCourseBody } = require('../../src/utils/BodyUtils');
const { getCourse,getCategoryCondition } = require('../../src/api/articleApi');
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
        const courses = await Course.findAll(condition)
        success(res, '查询课程列表成功', courses)
    } catch (e) {
        fail(res, '查询课程列表失败',e.message)
    }
});
//查询课程详情
router.get('/:id', validateIdParam,async function(req, res, next) {
    try {
        const course = await getCourse(req)
        if(course){
            success(res, '查询课程成功', course)
        }
    } catch (e) {
        fail(res, '查询课程失败',e.message)
    }
});
//模糊查询课程详情
router.get('/search/', async function(req, res, next) {
    try {
        console.log('Request URL:', req.url);
        console.log('Request Query:', req.query);

        const query = req.query
        const condition = {
            where: {},
            order: [['id', 'DESC']]
        };

        if (query.categoryId) {
            condition.where.categoryId = {
                [Op.eq]: query.categoryId
            };
        }

        if (query.userId) {
            condition.where.userId = {
                [Op.eq]: query.userId
            };
        }

        if (query.name) {
            condition.where.name = {
                [Op.like]: `%${ query.name }%`
            };
        }

        if (query.recommended) {
            condition.where = {
                recommended: {
                    // 需要转布尔值
                    [Op.eq]: query.recommended === 'true'
                }
            };
        }

        if (query.introductory) {
            condition.where = {
                introductory: {
                    [Op.eq]: query.introductory === 'true'
                }
            };
        }

        const courses = await Course.findAll(condition)
        success(res, '模糊查询课程列表成功', courses)
    } catch (e) {
        fail(res, '模糊查询课程列表失败', e.message)
    }
});

//创建课程
router.post('/create/', async function(req, res, next) {
    try {
        const article = await Course.create(filterCourseBody(req))
        success(res, '创建课程成功', article)
    } catch (e){
        fail(res, '创建课程失败', e.message)
    }
})

//删除指定id的课程
router.delete('/:id', async function(req, res, next) {
    try {
        const count = await Chapter.count({ where: { courseId: req.params.id } });
        if (count > 0) {
            throw new Error('当前课程有章节，无法删除。');
        }
        const course = await getCourse(req);
        await course.destroy()
        success(res, '删除课程成功', course)
    } catch (e) {
        fail(res, '删除文件失败', e.message)
    }
});

//更新课程
router.put('/:id', async function(req, res, next) {
    try {
        const course = await getCourse(req);
        const body = filterCourseBody(req);
        await course.update(body);
        success(res, '更新课程成功', course)
    } catch (e) {
        fail(res, '更新文件失败', e.message)
    }
});

//分页查询课程列表
router.get('/page', async function(req, res, next) {
    try {
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 1
        const offset = (currentPage - 1) * pageSize

        const condition = getCategoryCondition()
        const {count, rows} = await Course.findAndCountAll(condition)
        success(res, '分页查询成功', {
            courses: rows,
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