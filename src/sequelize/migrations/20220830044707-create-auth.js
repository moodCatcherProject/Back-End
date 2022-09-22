'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Auths', {
            authId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            sessionId: {
                type: Sequelize.BIGINT
            },
            provider: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            refreshToken: {
                type: Sequelize.STRING
            },
            loginFailCount: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            lastLoginTriedAt: {
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Auths');
    }
};
