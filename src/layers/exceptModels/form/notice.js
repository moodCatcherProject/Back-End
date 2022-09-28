/**
 * 최초 한 번 주는 알림
 *  - 회원가입
 *      => '새로운 무드캐쳐가 되어' 무드 포인트를 획득했습니다.
 * 자주 줘야 하는 알림
 *  - 내 게시물에 댓글이 달렸을 때
 *      => '다른 사용자가 내 게시물에 댓글을 달아' 무드 포인트를 획득했습니다.
 *      => 알림을 클릭하면 해당 페이지로 이동할 수 있도록(postId), 현재 확인해야 할 댓글 갯수를 적으면 좋겠음.
 *  - 게시물을 업로드 할 때(게시물 착장 정보 포함) (완)
 *      => '캐쳐님의 게시물이 성공적으로 무드의 바다에 떠올라' 무드 포인트를 획득했습니다.
 *
 * 하루 단위로 줄 알림
 *  - 로그인 할 때
 *      => '무드 캐쳐에 방문하여' 무드 포인트를 획득했습니다.
 *  - 메인화면 랭킹에 등재 됐을 때
 *      => ' 캐쳐님의 무드가 인정받아 랭킹에 등재되어' 무드 포인트를 획득했습니다.
 *  - 게시물 추천 누적
 *      => '캐쳐님의 게시물을 다른 캐쳐가 추천해 주어' 무드 포인트를 획득했습니다. (하루 정산한 포인트)
 *
 */

const { UserDetail, Notice } = require('../../../sequelize/models');

const updateIsExistsNotice = (userId) => {
    UserDetail.update(
        {
            isExistsNotice: true
        },
        {
            where: { detailId: userId }
        }
    );
};
const createNotice = async (userId, message, postId) => {
    Notice.create({
        userId,
        notice: message,
        postId
    });
};

const updateNotice = async (noticeData) => {
    Notice.update(
        {
            notice: noticeData.notice,
            duplecation: noticeData.duplecation
        },
        {
            where: { noticeId: noticeData.noticeId }
        }
    );
};
const checkNotice = async (userId, message, postId) => {
    const noticeData = await Notice.findAll({
        where: { userId, postId }
    });

    for (let notice of noticeData) {
        if (notice.notice == message && notice.postId == postId) {
            notice.duplecation += 1;

            updateNotice(notice);
            return;
        }
    }
    createNotice(userId, message, postId);
};

exports.createMessage = (userId, message, postId) => {
    console.log('알림 만들기');
    checkNotice(userId, message, postId);
    updateIsExistsNotice(userId);
};
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTY2NDMzMTA1MSwiZXhwIjoxNjY0MzMxMDgxfQ.jXFCybqEdVKJW1vva-Vpd5mdhPlFzEDUuX8xTKaOnoY

// Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTY2NDMyNjkyNSwiZXhwIjoxNjY0MzM0MTI1fQ.t-m3MfozocEdwi4anlMVIvtX3fb4rf_giOwGeyUrZGA
