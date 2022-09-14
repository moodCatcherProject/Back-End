const { StartMessage } = require('../../sequelize/models');
const exception = require('../exceptModels/_.models.loader');

const findRandomStartMessage = async (req, res, next) => {
    try {
        const random = Math.floor(Math.random() * 110);
        const msgData = await StartMessage.findByPk(random);

        res.status(200).json(
            new exception.FormDto('초기화면 메세지 출력', {
                startMsg: msgData.message.split('\r')[0]
            })
        );
    } catch (err) {
        next(err);
    }
};

module.exports = {
    findRandomStartMessage
};
