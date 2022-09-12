'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('HotPosts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            postid: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            imgUrl: {
                allowNull: false,
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('HotPosts');
    }
};
