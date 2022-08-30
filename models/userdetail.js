"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class UserDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserDetail.init(
        {
            detailId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },

            gender: {
                type: DataTypes.STRING,
            },
            age: {
                type: DataTypes.STRING,
            },
            moodPoint: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            repPostId: {
                type: DataTypes.INTEGER,
            },
            isExistsNotice: {
                type: DataTypes.BOOLEAN,
            },
        },
        {
            sequelize,
            modelName: "UserDetail",
        }
    );
    return UserDetail;
};
