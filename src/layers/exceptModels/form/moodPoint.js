const { UserDetail } = require('../../../sequelize/models');

findPointColumn = async (userId) => {
    return await UserDetail.findOne({
        where: { detailId: userId },
        attributes: ['pointArray'],
        raw: true
    });
};
addPoint = async (userId, pointArr) => {
    await UserDetail.update(
        {
            pointArray: pointArr
        },
        {
            where: { detailId: userId }
        }
    );
};
checkPoint = async (userId, idx, pointArr, point, maxPoint, msg) => {
    if (pointArr[idx] < maxPoint) {
        pointArr[idx] += point;
        await addPoint(userId, JSON.stringify(pointArr));
        return {
            pointArr,
            msg: msg + `현재: ${pointArr[idx]} , 최대치 : ${maxPoint}`
        };
    }
    return {
        pointArr,
        msg: '최대치에 도달'
    };
};

/**
 * @desc 로그인 시 200 무드 획득. 하루 200
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLogin = async (userId) => {
    const getPointNumber = 0;
    const point = 200;
    const maxPoint = 200;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(userId, getPointNumber, pointArr, point, maxPoint, '로그인, 200 증가');
};
/**
 * @desc 다른 사람이 나의 옷장을 열람할 시 50 무드 획득. 하루 최대1000
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLookMyCloser = async (userId) => {
    const getPointNumber = 1;
    const point = 50;
    const maxPoint = 1000;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '다른 사람이 나의 옷장 열람, 50무드 증가'
    );
};
/**
 * @desc 게시물을 작성했을 때. 업로드시 100포인트, 하루 최대500
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenCreatePost = async (userId) => {
    const getPointNumber = 2;
    const point = 100;
    const maxPoint = 500;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '내 게시물 업로드, 100무드 증가'
    );
};
/**
 * @desc 게시물의 아이템을 등록했을 때 100무드, 하루 최대2500
 * 이 함수를 한 번 실행하면 50포인트가 쌓이므로 아이템 갯수를 세어 반복문 돌리기
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenCreateItem = async (userId) => {
    const getPointNumber = 3;
    const point = 100;
    const maxPoint = 2500;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '내 아이템 업로드, 50무드 증가'
    );
};
/**
 * @desc 나의 게시물이 좋아요를 얻을 때 마다 10무드, 하루 최대1000
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenGetLike = async (userId) => {
    const getPointNumber = 4;
    const point = 10;
    const maxPoint = 1000;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '내 게시물 좋아요, 10무드 증가'
    );
};
/**
 * @desc 다른 사람의 게시물에 좋아요를 누를 떄 마다 30무드, 하루 최대 600제한
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLeaveLike = async (userId) => {
    const getPointNumber = 5;
    const point = 10;
    const maxPoint = 1000;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '다른사람의 게시물 좋아요, 30무드 증가'
    );
};
/**
 * @desc 타인의 게시물에 한정, 댓글을 남기면 30무드 증가
 * @param {*} userId
 * @returns
 */
exports.whenLeaveComment = async (userId) => {
    const getPointNumber = 6;
    const point = 30;
    const maxPoint = 600;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '타인의 게시물에 댓글 남기기, 30무드 증가'
    );
};
/**
 * @desc 나의 게시물에 댓글이 달렸을 때, 30무드 증가
 * @param {*} userId
 * @returns
 */
exports.whenLeaveComment = async (userId) => {
    const getPointNumber = 7;
    const point = 30;
    const maxPoint = 600;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '나의 게시물에 댓글이 달림, 30무드 증가'
    );
};
