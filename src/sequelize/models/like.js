"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Like.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.Like.belongsTo(models.Post, {
                foreignKey: "postId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
        }
    }
    Like.init(
        {
            likeId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Like",
        }
    );
    return Like;
};
