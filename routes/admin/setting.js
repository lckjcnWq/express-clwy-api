const express = require('express');
const router = express.Router();
const {Setting} = require('../../models');
const { filterSettingBody } = require('../../src/utils/BodyUtils');
const { getSetting } = require('../../src/api/articleApi');
const { success,fail } = require('../../src/common/ResponseBean');

//查询设置详情
router.get('/',async function(req, res, next) {
    try {
        const setting = await getSetting(req)
        if(setting){
            success(res, '查询设置成功', setting)
        }
    } catch (e) {
        fail(res, '查询设置失败',e.message)
    }
});

//更新设置
router.put('/', async function(req, res, next) {
    try {
        const setting = await getSetting(req);
        const body = filterSettingBody(req);
        await setting.update(body);
        success(res, '更新设置成功', setting)
    } catch (e) {
        fail(res, '更新设置失败', e.message)
    }
});


module.exports = router;