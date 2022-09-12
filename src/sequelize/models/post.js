'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Post.hasMany(models.Item, {
                foreignKey: 'postId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
            models.Post.hasMany(models.Like, {
                foreignKey: 'postId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
            models.Post.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
            models.Post.hasMany(models.Comment, {
                foreignKey: 'postId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
        }
    }
    Post.init(
        {
            postId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: false
            },
            imgUrl: {
                type: DataTypes.STRING,
                allowNull: false
            },
            likeCount: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            delete: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            timestamps: true,
            modelName: 'Post'
        }
    );
    return Post;
};
