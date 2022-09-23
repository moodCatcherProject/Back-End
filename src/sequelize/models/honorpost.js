'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HonorPost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.HonorPost.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
            models.HonorPost.belongsTo(models.Post, {
                foreignKey: 'postId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
        }
    }
    HonorPost.init(
        {
            honorId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rank: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE
            }
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'HonorPost'
        }
    );
    return HonorPost;
};
