'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Auth extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }
    Auth.init(
        {
            authId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            sessionId: {
                type: DataTypes.BIGINT
            },
            provider: {
                type: DataTypes.STRING,

                allowNull: false
            },
            email: {
                type: DataTypes.STRING
            },
            password: {
                type: DataTypes.STRING
            },
            latitude: {
                type: DataTypes.FLOAT,
                defaultValue: null
            },
            longitude: {
                type: DataTypes.FLOAT,
                defaultValue: null
            }
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'Auth'
        }
    );
    return Auth;
};
