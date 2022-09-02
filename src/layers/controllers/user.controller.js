const e = require('express');
const userService = require('../services/user.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const deleteUser = async (req, res, next) => {
    const userId = req.user.userId;
    try {
        await userService.deleteUser(userId);
        return res.status(200).json(new exception.FormDto('유저 정보 삭제 성공'));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    deleteUser
};
