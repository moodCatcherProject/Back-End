'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HashAuthNum extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    HashAuthNum.init(
        {
            authNumId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            hashAuthNum: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            timestamps: true,
            modelName: 'HashAuthNum'
        }
    );
    return HashAuthNum;
};
