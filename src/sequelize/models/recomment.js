'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Recomment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Recomment.belongsTo(models.Comment, {
                foreignKey: 'commentId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
        }
    }
    Recomment.init(
        {
            recommentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false
            },
            commentId: {
                type: DataTypes.INTEGER,
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
            modelName: 'Recomment'
        }
    );
    return Recomment;
};
