const e = require('express');
const userService = require('../services/user.service');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const getUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const userStatus = await userService.getUser(userId);

        return res.status(200).json(new exception.FormDto('유저 정보 조회 성공', { userStatus }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updateUser = async (req, res, next) => {
    try {
        const { userId, imgUrl } = res.locals.user;
        const { nickname, gender, age } = req.query;
        const imageFileName = req.file ? req.file.key : imgUrl;

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
const updateProfileIcon = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { profileIcon } = req.body;

        const userStatus = await userService.updateProfileIcon(userId, profileIcon);

        return res
            .status(201)
            .json(new exception.FormDto('프로필 아이콘 변경 성공', { userStatus }));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const deleteUser = async (req, res, next) => {
    const { userId } = res.locals.user;
    try {
        await userService.deleteUser(userId);
        return res.status(200).json(new exception.FormDto('유저 정보 삭제 성공'));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUser,
    updateUser,
    updateProfileIcon,
    deleteUser
};
