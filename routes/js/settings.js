const express = require('express');
const router = express.Router();
const { NotFoundError } = require('../../src/bean/NotFoundError');
const { Course, Category, User,Chapter,Article ,Setting  } = require('../../models');
const { success,fail,failure } = require('../../src/common/ResponseBean');
const { Op } = require('sequelize');
/**
 * 查询系统信息
 * GET /admin/settings
 */
router.get('/', async function (req, res) {
    try {
        const setting = await Setting.findOne();
        if (!setting) {
            throw new NotFoundError('未找到系统设置，请联系管理员。')
        }

        success(res, '查询系统信息成功。', { setting });
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;