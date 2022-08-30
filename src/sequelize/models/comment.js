"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Comment.hasMany(models.Recomment, {
                foreignKey: "commentId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.Comment.belongsTo(models.Post, {
              foreignKey: "postId",
              onDelete: "cascade",
              onUpdate: "cascade",
          });
        }
    }
    Comment.init(
        {
            commentId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            content: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Comment",
        }
    ); 
    return Comment;
};
