'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Recomments', {
      recommentId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW

      }
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Recomments');
  }
};