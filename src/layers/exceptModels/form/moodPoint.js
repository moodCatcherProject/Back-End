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
 * @desc 로그인 시 100 무드 획득. 하루 최대100
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLogin = async (userId) => {
    const getPointNumber = 0;
    const point = 100;
    const maxPoint = 100;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '로그인, 100무드 증가'
    );
};
/**
 * @desc 다른 사람이 나의 옷장을 열람할 시 10 무드 획득. 하루 최대500
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLookMyCloser = async (userId) => {
    const getPointNumber = 1;
    const point = 10;
    const maxPoint = 500;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '다른 사람이 나의 옷장 열람, 10무드 증가'
    );
};
/**
 * @desc 게시물을 작성했을 때. 업로드시 50포인트, 하루 최대250
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenCreatePost = async (userId) => {
    const getPointNumber = 2;
    const point = 50;
    const maxPoint = 250;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '내 게시물 업로드, 50무드 증가'
    );
};
/**
 * @desc 게시물의 아이템을 등록했을 때 50무드, 하루 최대1250
 * 이 함수를 한 번 실행하면 50포인트가 쌓이므로 아이템 갯수를 세어 반복문 돌리기
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenCreateItem = async (userId) => {
    const getPointNumber = 3;
    const point = 50;
    const maxPoint = 1250;
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
 * @desc 나의 게시물이 좋아요를 얻을 때 마다 1무드, 하루 최대1000
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenGetLike = async (userId) => {
    const getPointNumber = 4;
    const point = 1;
    const maxPoint = 1000;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);
    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '내 게시물 좋아요, 1무드 증가'
    );
};
// exports.whenGetComment = async (userId) => {
//     const getPointNumber = 5;
//     const point = 5;
//     const maxPoint = 1000;
//     const pointData = await findPointColumn(userId);
//     const pointArr = JSON.parse(pointData.pointArray);
//     return await checkPoint(
//         userId,
//         getPointNumber,
//         pointArr,
//         point,
//         maxPoint,
//         '내 게시물 좋아요, 1무드 증가'
//     );
// };
