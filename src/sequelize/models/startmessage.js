'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StartMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StartMessage.init({
    
    message: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    modelName: 'StartMessage',
  });
  return StartMessage;
};