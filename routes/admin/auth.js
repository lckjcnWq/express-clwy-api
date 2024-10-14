const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const { Op } = require('sequelize');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../src/bean/error');
const { success,fail,failure } = require('../../src/common/ResponseBean');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();



/**
 * 管理员登录
 * POST /admin/auth/sign_in
 */
router.post('/sign_in', async (req, res) => {
    try {
        const {login, password} = req.body;
        if(!login){
            throw new BadRequestError('邮箱/用户名必须填写');
        }
        if(!password) {
            throw new BadRequestError('密码必须填写。');
        }
        const condition = {
            where: {
                [Op.or]: [
                    { email: login },
                    { username: login }
                ]
            }
        };
        // 通过email或username，查询用户是否存在
        const user = await User.findOne(condition);
        if (!user) {
            throw new NotFoundError('用户不存在，无法登录。');
        }
        // 验证密码
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('密码错误。');
        }
        // 验证是否管理员
        if (user.role !== 100) {
            throw new UnauthorizedError('您没有权限登录管理员后台。');
        }

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }, process.env.SECRET, { expiresIn: '1d' });

        success(res, '登录成功。', token);
    } catch (error) {
        failure(res,error);
    }
});

module.exports = router;
