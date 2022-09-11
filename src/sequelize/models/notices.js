'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Notice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            models.Notice.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'cascade',
                onUpdate: 'cascade'
            });
        }
    }
    Notice.init(
        {
            noticeId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            notice: { type: DataTypes.STRING, allowNull: false },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            postId: { type: DataTypes.INTEGER },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            timestamps: true,
            modelName: 'Notice'
        }
    );
    return Notice;
};
