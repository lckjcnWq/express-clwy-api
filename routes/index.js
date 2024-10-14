const express = require('express');
const router = express.Router();
const { Course, Category, User } = require('../models');
const { success,fail,failure } = require('../src/common/ResponseBean');


/**
 * 查询首页数据
 * GET /
 */
router.get('/js/index', async function (req, res, next) {
  try {
    // 焦点图（推荐的课程）
    const recommendedCourses = await Course.findAll({
      attributes: { exclude: ['categoryId', 'userId', 'content'] },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'nickname', 'avatar', 'company'],
        }
      ],
      where: { recommended: true },
      order: [['id', 'desc']],
      limit: 10
    });

    // 人气课程
    const likesCourses = await Course.findAll({
      attributes: { exclude: ['categoryId', 'userId', 'content'] },
      order: [['likesCount', 'desc'], ['id', 'desc']],
      limit: 10
    });

    // 入门课程
    const introductoryCourses = await Course.findAll({
      attributes: { exclude: ['categoryId', 'userId', 'content'] },
      where: { introductory: true },
      order: [['id', 'desc']],
      limit: 10
    });
    success(res, '获取首页数据成功。', {
      recommendedCourses,
      likesCourses,
      introductoryCourses
    });
  } catch (error) {
    failure(res, error);
  }
});

module.exports = router;
