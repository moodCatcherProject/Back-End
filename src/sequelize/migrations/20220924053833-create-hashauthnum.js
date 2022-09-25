'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('HashAuthNums', {
            authNumId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false
            },
            hashAuthNum: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('HashAuthNums');
    }
};
