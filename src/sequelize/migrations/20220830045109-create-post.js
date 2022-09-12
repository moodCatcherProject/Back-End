'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            postId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            content: {
                type: Sequelize.STRING
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            gender: {
                type: Sequelize.STRING,
                allowNull: false
            },
            imgUrl: {
                type: Sequelize.STRING,
                allowNull: false
            },
            likeCount: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            delete: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Posts');
    }
};
