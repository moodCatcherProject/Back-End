'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class MoodPoint extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.MoodPoint.belongsTo(models.User, {
                foreignKey: 'pointId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
        }
    }
    MoodPoint.init(
        {
            pointId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            whenLogin: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            whenLookCloset: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            whenCreatePost: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            whenCreateItem: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            whenGetLike: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            whenGetComment: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'MoodPoint'
        }
    );
    return MoodPoint;
};
