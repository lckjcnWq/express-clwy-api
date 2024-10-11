const express = require('express');
const router = express.Router();
const {Article} = require('../../models');

/* GET home page. */
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

module.exports = router;