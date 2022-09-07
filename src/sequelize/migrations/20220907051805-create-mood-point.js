'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('MoodPoints', {
            pointId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            whenLogin: {
                type: Sequelize.INTEGER,
                default: 0,
                allowNull: false
            },
            whenLookCloset: {
                type: Sequelize.INTEGER,
                default: 0,
                allowNull: false
            },
            whenCreatePost: {
                type: Sequelize.INTEGER,
                default: 0,
                allowNull: false
            },
            whenCreateItem: {
                type: Sequelize.INTEGER,
                default: 0,
                allowNull: false
            },
            whenGetLike: {
                type: Sequelize.INTEGER,
                default: 0,
                allowNull: false
            },
            whenGetComment: {
                type: Sequelize.INTEGER,
                default: 0,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('MoodPoints');
    }
};
