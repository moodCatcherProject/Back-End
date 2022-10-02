const kakaoMapService = require('../services/kakaoMap.service.js');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const updatePosition = async (req, res, next) => {
    const { latitude, longitude } = req.body;
    const { userId } = res.locals.user;
    console.log(latitude, longitude, userId);

    try {
        const isExistsMap = await kakaoMapService.updatePosition(userId, latitude, longitude);

        return res
            .status(200)
            .json(
                new exception.FormDto('유저 좌표 업데이트', { isExistsMap, latitude, longitude })
            );
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const findAroundCatcher = async (req, res, next) => {
    const { dist } = req.query;
    console.log(dist);
    const { userId } = res.locals.user;

    try {
        const positionData = await kakaoMapService.findAroundCatcher(userId, parseFloat(dist));
        console.log(positionData);
        return res
            .status(200)
            .json(new exception.FormDto('주변 사람 유저정보 배열 반환', positionData));
    } catch (err) {
        next(err);
    }
};

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const onOffMap = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const isExistsMap = await kakaoMapService.onOffMap(userId);
        if (isExistsMap) {
            return res.status(201).json(new exception.FormDto('무드 맵 ON', { isExistsMap }));
        } else {
            return res.status(201).json(new exception.FormDto('무드 맵 OFF', { isExistsMap }));
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    updatePosition,
    findAroundCatcher,
    onOffMap
};
