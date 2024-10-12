const express = require('express');
const router = express.Router();
const {Article} = require('../../models');
const { Op } = require('sequelize');
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

        res.json({
            status: true,
            message: '查询文章列表成功',
            data: {
                atricles
            }
        });
    } catch (e) {
        res.json({
            status: false,
            message: '查询文章列表失败',
            errors:[e.message]
        });
    }
});


//查询文章详情
router.get('/:id', validateIdParam,async function(req, res, next) {
    try {
        const {id} = req.params
        const atricle = await Article.findByPk(id)
        if(atricle){
            res.json({
                status: true,
                message: '查询文章成功',
                data: atricle
            });
        }else {
            res.status(404).json({
                status: false,
                message: '文章不存在'
            });
        }
    } catch (e) {
        res.json({
            status: false,
            message: '查询文章失败',
            errors:[e.message]
        });
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

        res.json({
            status: true,
            message: '模糊查询文章列表成功',
            data: {
                articles
            }
        })

    } catch (e) {
        res.json({
            status: false,
            message: '模糊查询文章列表失败',
            errors:[e.message]
        });
    }
});


//删除指定id的文章
router.delete('/:id', async function(req, res, next) {
    try {
        const {id} = req.params
        const atricle = await Article.findByPk(id)
        if(atricle){
            await atricle.destroy()
            res.json({
                status: true,
                message: '删除文章成功',
            });
        }else {
            res.status(404).json({
                status: false,
                message: '删除文件失败'
            });
        }
    } catch (e) {
        res.json({
            status: false,
            message: '删除文件失败',
            errors:[e.message]
        });
    }
});

//更新文章
router.put('/:id', async function(req, res, next) {
    try {
        const {id} = req.params
        const atricle = await Article.findByPk(id)
        if(atricle){
            await atricle.update(req.body)
            res.json({
                status: true,
                message: '更新文章成功',
                data: atricle
            });
        }else {
            res.status(404).json({
                status: false,
                message: '文章未找到'
            });
        }
    } catch (e) {
        res.json({
            status: false,
            message: '更新文章失败',
            errors:[e.message]
        });
    }
});

module.exports = router;