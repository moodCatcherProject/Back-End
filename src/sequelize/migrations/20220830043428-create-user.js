'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            userId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            nickname: {
                type: Sequelize.STRING,
                allowNull: false
            },
            imgUrl: {
                type: Sequelize.STRING
            },
            grade: {
                type: Sequelize.STRING
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};
