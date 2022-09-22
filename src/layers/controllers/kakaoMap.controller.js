const kakaoMapService = require('../services/kakaoMap.service.js');
const exception = require('../exceptModels/_.models.loader');
const updatePosition = async (req, res, next) => {
    const { latitude, longitude } = req.body;
    const { userId } = res.locals.user;
    console.log(latitude, longitude, userId);
    const positionData = kakaoMapService.updatePosition(userId, latitude, longitude);
    return res.status(200).json(new exception.FormDto('유저 좌표 업데이트', positionData));
};

const findAroundCatcher = async (req, res, next) => {
    const { dist } = req.query;
    console.log(dist);
    const { userId } = res.locals.user;
    const positionData = await kakaoMapService.findAroundCatcher(userId, parseFloat(dist));
    console.log(positionData);
    return res
        .status(200)
        .json(new exception.FormDto('주변 사람 유저정보 배열 반환', positionData));
};

module.exports = {
    updatePosition,
    findAroundCatcher
};
