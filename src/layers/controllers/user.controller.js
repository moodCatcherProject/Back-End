const e = require('express');
const userService = require('../services/user.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updateUser = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { nickname, gender, age } = req.body;
        const imageFileName = req.file ? req.file.key : null;

        const userStatus = await userService.updateUser(
            userId,
            nickname,
            gender,
            age,
            imageFileName
        );

        return res.status(201).json(new exception.FormDto('유저 정보 변경 성공', { userStatus }));
    } catch (err) {
        next(err);
    }
};

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
    updateUser,
    deleteUser
};
