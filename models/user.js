"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            models.User.hasMany(models.Post, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.hasMany(models.Like, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.hasMany(models.Notice, {
                foreignKey: "userId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.belongsTo(models.UserDetail, {
                foreignKey: "detailId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            models.User.belongsTo(models.Auth, {
                foreignKey: "authId",
                onDelete: "cascade",
                onUpdate: "cascade",
            });
            // define association here
        }
    }
    User.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            detailId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            authId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            nickname: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            imgUrl: {
                type: DataTypes.STRING,
            },
            grade: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: "User",
        }
    );
    return User;
};
