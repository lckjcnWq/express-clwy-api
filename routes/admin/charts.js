const express = require('express');
const router = express.Router();
const { sequelize, User } = require('../../models');
const { Op } = require('sequelize');
const { success,fail } = require('../../src/common/ResponseBean');

/**
 * 统计用户性别
 * GET /admin/charts/sex
 */
router.get('/sex', async function (req, res) {
    try {
        const male = await User.count({ where: { sex: 0 } });
        const female = await User.count({ where: { sex: 1 } });
        const unknown = await User.count({ where: { sex: 2 } });

        const data = [
            { value: male, name: '男性' },
            { value: female, name: '女性' },
            { value: unknown, name: '未选择' }
        ];

        success(res, '查询用户性别成功。', data);
    } catch (error) {
        fail(res, '查询用户性别失败',error);
    }
});

/**
 * 统计每个月用户数量
 * GET /admin/charts/user
 */
router.get('/user', async (req, res) => {
    try {
        const [results] = await sequelize.query(
            "SELECT DATE_FORMAT(`createdAt`, '%Y-%m') AS `month`, COUNT(*) AS `value` FROM `Users` GROUP BY `month` ORDER BY `month` ASC",
            { logging: console.log }
        );

        const data = {
            months: [],
            values: [],
        };

        results.forEach(item => {
            data.months.push(item.month);
            data.values.push(item.value);
        });
        success(res, '查询每月用户数量成功。', data);
    } catch (err) {
        fail(res,'查询每月用户数量失败', err);
    }
});


module.exports = router;
