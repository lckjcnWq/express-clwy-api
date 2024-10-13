'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {msg: '名称已存在，请选择其它名称'},
      validate:{
        notNull:{msg: 'name is required'},
        notEmpty: {msg: '名称不能为空'},
        len: {args: [2, 45], msg: '名称长度需要在1 ~ 45个字符之间'}
      }
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '排序必须填写。' },
        notEmpty: { msg: '排序不能为空。' },
        isInt: { msg: '排序必须为整数。' },
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};