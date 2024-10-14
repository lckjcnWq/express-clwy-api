const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../src/bean/error');
const { success,fail,failure } = require('../../src/common/ResponseBean');
const bcrypt = require('bcryptjs');
const {User} = require('../../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        // ...
        const  {token} = req.headers;
        if(!token){
            throw new UnauthorizedError('token is required');
        }
        const decoded = jwt.verify(token, process.env.SECRET)
        // 从 jwt 中，解析出之前存入的 userId
        const { userId } = decoded;
        // 查询一下，当前用户
        const user = await User.findByPk(userId);
        if (!user) {
            throw new UnauthorizedError(`用户ID ${userId} 不存在。`)
        }

        // 验证当前用户是否是管理员
        if (user.role !== 100) {
            throw new UnauthorizedError('您没有权限使用当前接口。')
        }
        req.user = user;
        next()
    } catch (error) {
        failure(res, error);
    }
};
