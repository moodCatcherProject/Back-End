const noticeService = require('../services/notice.service');
const exception = require('../exceptModels/_.models.loader');

//NOTICE CRUD
const findAllNotice = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const noticeData = await noticeService.findAllNotice(userId);
        return res.status(200).json(new exception.FormDto('알림 보내기 성공', noticeData));
    } catch (err) {
        next(err);
    }
};

const deleteAllNotice = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        noticeService.deleteAllNotice(userId);
        return res.status(200).json(new exception.FormDto('알림 전체 삭제 성공'));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    findAllNotice,
    deleteAllNotice
};
