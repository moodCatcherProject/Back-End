'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserDetails', {
            detailId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            gender: {
                type: Sequelize.STRING
            },
            age: {
                type: Sequelize.STRING
            },
            moodPoint: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            repPostId: {
                type: Sequelize.INTEGER
            },
            isExistsNotice: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            pointArray: {
                type: Sequelize.STRING,
                default: '[0,0,0,0,0,0,0]',
                allowNull: false
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UserDetails');
    }
};
