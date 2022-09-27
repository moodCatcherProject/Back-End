const { UserDetail, Comment, Post, Like } = require('../../../sequelize/models');
const likeRepository = require('../../repositories/like.repository');
const notice = require('../form/notice');

const noticeMessageArray = {
    whenSignUp: `✨ 새로운 캐처님을 환영합니다!! ✨`,

    whenLogin: `무드캐처에 오신 것을 환영합니다!`,

    //whenCreatePost: `게시물이 성공적으로 무드의 바다에 떠올라`,
    //게시물의 사용자에게만
    whenLeaveMyPostComment: `게시물에 새로운 댓글이 있어요`,

    //댓글의 작성자에게만
    whenLeaveMyCommentOfRecomment: '댓글에 새로운 댓글이 있어요',

    //해당 캐처에게
    // whenUpgradeRank: `🎉캐처님의 등급이 ${grade}로 상승했습니다!`,

    whenInRankingMyPost: `👑 인기 게시물에 선정되었습니다!! 👑`
};
/**
 *
 * @param {Number} userId
 * @returns 포인트의 정보를 담은 배열 pointArray
 */
const findPointColumn = async (userId) => {
    return await UserDetail.findOne({
        where: { detailId: userId },
        attributes: ['pointArray'],
        raw: true
    });
};
const addPoint = async (userId, pointArr) => {
    await UserDetail.update(
        {
            pointArray: pointArr
        },
        {
            where: { detailId: userId }
        }
    );
};

/**
 * @desc 포인트를 얻는 방법에 따라 UserDetail테이블의 pointArray 에 배열로 넣어줍니다.
 * (정확히는 배열을 문자열로 변환), 예를 들어 pointArray[0]은 유저가 로그인 했을 때
 * 얻는 포인트를 저장합니다.
 * @param {number} userId usreId의 유저에게 알림을 넣어줌.
 * @param {number} idx pointArr에서 참조할 index
 * @param {Array} pointArr 획득한 포인트의 배열
 * @param {number} point 한 번에 얻는 포인트. maxPoint를 넘어선 안됨.
 * @param {number} maxPoint 하루에 얻을 수 있는 포인트 제한.
 * @param {string} msg 서버측에서 알림을 받기위한 확인 작업
 * @param {string} noticeMessage !!클라이언트에게 보내줄 알림. 주의해서 쓸 것!
 * @param {number} postId 알림을 눌렀을 때 해당 게시물로 갈 수 있도록 해줌.
 * @returns
 */
const checkPoint = async (
    userId,
    idx,
    pointArr,
    point,
    maxPoint,
    msg,
    noticeMessage,
    postId = -1
) => {
    while (pointArr[idx] == undefined) {
        pointArr.push(0);
    }
    if (pointArr[idx] < maxPoint) {
        pointArr[idx] += point;
    }

    console.log(noticeMessage, userId);
    await addPoint(userId, JSON.stringify(pointArr));
    if (noticeMessage) {
        notice.createMessage(userId, noticeMessage, postId);
    }
    return {
        pointArr,
        msg: msg + `현재: ${pointArr[idx]} , 최대치 : ${maxPoint}`
    };
};

const directUpPoint = (userId, message, postId = -1) => {
    notice.createMessage(userId, message, postId);
};

const isExistCheckEqualUser = (userIdOfLoginUser, userId) => {
    if (userIdOfLoginUser !== userId) {
        return true;
    }
    return false;
};

/**
 *
 * @param {Number} commentId
 * @returns commentId 댓글의 작성자 userId
 */
const findUserIdForComment = async (commentId) => {
    const userId = await Comment.findOne({
        where: { commentId },
        raw: true,
        attributes: ['userId']
    });
    return userId.userId;
};

/**
 *
 * @param {Number} postId
 *
 * @returns postId 게시물의 작성자 userId
 */
const findUserIdForPost = async (postId) => {
    const userId = await Post.findOne({
        where: { postId },
        raw: true,
        attributes: ['userId']
    });

    return userId.userId;
};
/**
 * @desc 회원가입을 축하한다는 메세지 생성(완)
 * @param {number} userId
 */
exports.whenSignUp = (userId) => {
    directUpPoint(userId, noticeMessageArray.whenSignUp);
};

/**
 * @desc 로그인 시 200 무드 획득. 하루 200(완)
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLogin = async (userId) => {
    const getPointNumber = 0;
    const point = 200;
    const maxPoint = 200;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);

    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '로그인, 200 증가',
        noticeMessageArray.whenLogin
    );
};
/**
 * @desc 다른 사람이 나의 옷장을 열람할 시 50 무드 획득. 하루 최대1000(완)
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
 * @desc 게시물을 작성했을 때. 업로드시 100포인트, 하루 최대500(완)
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenCreatePost = async (userId, postId) => {
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
 * 이 함수를 한 번 실행하면 100포인트가 쌓이므로 아이템 갯수를 세어 반복문 돌리기(완)
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
        '내 아이템 업로드, 100무드 증가'
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
 * @desc 다른 사람의 게시물에 좋아요를 누를 때 마다 30무드, 하루 최대 600제한
 * @param {number} userId
 * @param {number} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLeaveLike = async (userId, postId) => {
    if (!isExistCheckEqualUser(userId, await findUserIdForPost(postId))) {
        return { msg: '자신의 게시물에 좋아요.' };
    }
    const getPointNumber = 5;
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
        '다른사람의 게시물 좋아요, 30무드 증가'
    );
};

/**
 * @desc 타인의 게시물에 한정, 댓글을 남기면 30무드 증가
 * @param {*} userId
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLeaveComment = async (userId, postId) => {
    const userIdOfPost = await findUserIdForPost(postId);
    if (!isExistCheckEqualUser(userId, userIdOfPost)) {
        return { msg: '자신의 게시물에 댓글.' };
    }

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
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenLeaveMyPostComment = async (userId, postId) => {
    const userIdOfPost = await findUserIdForPost(postId);
    if (!isExistCheckEqualUser(userId, userIdOfPost)) {
        return { msg: '자신의 게시물에 댓글.' };
    }
    const getPointNumber = 7;
    const point = 30;
    const maxPoint = 600;
    const pointData = await findPointColumn(userIdOfPost);
    const pointArr = JSON.parse(pointData.pointArray);

    return await checkPoint(
        userIdOfPost,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '나의 게시물에 댓글이 달림, 30무드 증가',
        noticeMessageArray.whenLeaveMyPostComment,
        postId
    );
};

exports.whenLeaveMyCommentOfRecomment = async (userId, postId, commentId) => {
    const userIdOfPost = await findUserIdForPost(postId);
    const userIdOfComment = await findUserIdForComment(commentId);

    const getPointNumber = 6;
    const point = 0;

    const maxPoint = 600;
    const pointData = await findPointColumn(userIdOfPost);
    const pointArr = JSON.parse(pointData.pointArray);

    return await checkPoint(
        userIdOfComment,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '나의 댓글에 대댓글이 달림, 30무드 증가',
        noticeMessageArray.whenLeaveMyCommentOfRecomment,
        postId
    );
};

/**
 * @version 1.1 한 사람이 여러 자리에 오르면 그만큼 무드포인트 지급
 * @desc 1등 3000, 2등 2000, 3등 1000 무드포인트 지급
 * @param {number} userId hot posts에 선정된 게시물의 작성자
 * @param {number} postId hot posts에 선정된 게시물
 * @returns 포인트를 올렸으면 현재 포인트 배열, 포인트, 최대치 실패시 '최대치에 도달' 메시지
 */
exports.whenInRankingMyPost = async (userId, postId, moodpoint) => {
    const getPointNumber = 8;
    const point = moodpoint;
    const maxPoint = 6000;
    const pointData = await findPointColumn(userId);
    const pointArr = JSON.parse(pointData.pointArray);

    return await checkPoint(
        userId,
        getPointNumber,
        pointArr,
        point,
        maxPoint,
        '게시물 랭킹에 등재',
        noticeMessageArray.whenInRankingMyPost,
        postId
    );
};
