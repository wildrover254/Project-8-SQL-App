'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {};
    Book.init({
      title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Please add a Title"
          }          
        }
      },
      author: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Please add an Author"
          }
        }
      },
      genre: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      }
    }, {
      sequelize,
      modelName: 'Book',
   });
  return Book;
};