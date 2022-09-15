'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HotPost extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    HotPost.init(
        {
            postId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            imgUrl: {
                type: DataTypes.STRING,
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
            modelName: 'HotPost'
        }
    );
    return HotPost;
};
