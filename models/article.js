'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull:{
          msg: 'Title is required'
        },
        notEmpty: {
          msg: '标题不能为空。'
        },
        len: {
          args: [1, 45],
          msg: '标题长度需要在1 ~ 45个字符之间。'
        }
      }
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};