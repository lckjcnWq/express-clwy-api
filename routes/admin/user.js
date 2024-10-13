const express = require('express');
const router = express.Router();
const {User} = require('../../models');
const { Op } = require('sequelize');
const { filterUserBody } = require('../../src/utils/BodyUtils');
const { getUser } = require('../../src/api/articleApi');
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
        const users = await User.findAll(condition)
        success(res, '查询用户列表成功', users)
    } catch (e) {
        fail(res, '查询用户列表失败',e.message)
    }
});
//查询用户详情
router.get('/:id', validateIdParam,async function(req, res, next) {
    try {
        const user = await getUser(req)
        if(user){
            success(res, '查询用户成功', user)
        }
    } catch (e) {
        fail(res, '查询用户失败',e.message)
    }
});
//模糊查询用户详情
router.get('/search/', async function(req, res, next) {
    try {
        console.log('Request URL:', req.url);
        console.log('Request Query:', req.query);

        const query = req.query
        const condition = {
            where: {},
        };

        if (query.email) {
            condition.where.email = {
                [Op.eq]: query.email
            };
        }

        if (query.username) {
            condition.where.username = {
                [Op.eq]: query.username
            };
        }

        if (query.nickname) {
            condition.where.nickname = {
                [Op.like]: `%${ query.nickname }%`
            };
        }

        if (query.role) {
            condition.where.role = {
                [Op.eq]: query.role
            };
        }

        const articles = await User.findAll(condition)
        success(res, '模糊查询用户列表成功', articles)
    } catch (e) {
        fail(res, '模糊查询用户列表失败', e.message)
    }
});

//创建用户
router.post('/create/', async function(req, res, next) {
    try {
        const user = await User.create(filterUserBody(req))
        success(res, '创建用户成功', user)
    } catch (e){
        fail(res, '创建用户失败', e.message)
    }
})

//更新用户
router.put('/:id', async function(req, res, next) {
    try {
        const user = await getUser(req);
        const body = filterUserBody(req);
        await user.update(body);
        success(res, '更新用户成功', user)
    } catch (e) {
        fail(res, '更新文件失败', e.message)
    }
});

//分页查询用户列表
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
        if (query.nickname) {
            condition.where = {
                nickname: {
                    [Op.like]: `%${query.nickname}%`
                }
            };
        }
        const {count, rows} = await User.findAndCountAll(condition)
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