//하루 한 번 실행해야 하는 기능들 모음.
/**
 * 1. 좋아요 정산 : 유저들이 하루 동안 모은 무드포인트
 * (UserDetail의 pointArray)를  무드포인트(UserDetail의 moodPoint)에
 * 더해주기 => 정산 시간을 더 짧게 시도해볼지 생각해볼 것.
 * pointArray 다시 0으로 맞춰줘야함.
 *
 * 2. 사용자 등급 정산 : 사용자의 등급이 상승할 조건을 충족 시켰다면
 * 상승 시키고 알림을 넣어주기. 유저의 등급 아이콘도 바꿔줘야함.
 *
 * 3. hot posts : 전날 가장 좋아요를 많이 받은 게시물을 HotPosts 테이블에 저장 후
 * 전체 Post 테이블의 todayLikeCount를 0으로 리셋시키기
 * => 만약 게시물이 삭제 되었을때는??
 * ==> form/moodPint.js 의 whenInRankingMyPost 실행 시켜주셔야 해요!
 *
 * 4. 알림이 2일 이상 지났다면 삭제하기
 *
 *
 */

//스케줄러
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
const schedule = require('node-schedule');
const { User, UserDetail, Post, HotPost } = require('../../../sequelize/models');
const exception = require('../_.models.loader');

//한국시간으로 새벽 00시 10분 00초 마다 실행 (우분투에서는 9시간의 시차가 있어보여요.)
schedule.scheduleJob('0 10 15 * * *', () => {
    scheduleHandller();
});

const createHotPost = schedule.scheduleJob('* * * * * *', async () => {
    //Posts 테이블에서 todayLikeCount가 높은 3개의 data 조회
    const hotPosts = await Post.findAll({
        order: [['todayLikeCount', 'DESC']],
        attributes: ['postId', 'imgUrl', 'userId'],
        limit: 3,
        where: { delete: false },
        raw: true
    });

    //HotPosts 테이블 전체 삭제(이전 hotposts 삭제)
    await HotPost.destroy({
        where: {}
    });

    //HotPosts 테이블에 조회한 3개의 data 저장
    async function createHotPosts() {
        await Promise.all(
            hotPosts.map((post) => {
                HotPost.create({
                    postId: post.postId,
                    imgUrl: post.imgUrl
                });
            })
        );
    }
    createHotPosts();

    // Posts 테이블의 todayLikeCount 0으로 리셋
    await Post.update(
        {
            todayLikeCount: 0
        },
        {
            where: {}
        }
    );

    // 랭킹 등재 moodPoints 적립
    exception.MoodPoint.whenInRankingMyPost(hotPosts[0].userId, hotPosts[0].postId);
    exception.MoodPoint.whenInRankingMyPost(hotPosts[1].userId, hotPosts[1].postId);
    exception.MoodPoint.whenInRankingMyPost(hotPosts[2].userId, hotPosts[2].postId);
});

// const totalLikeCount = async () => {
//     const pointArrays = await UserDetail.findAll({
//         attributes: ['detailId', 'moodPoint', 'pointArray'],
//         raw: true
//     });
//     console.log(pointArrays);
//     for (let pointArray of pointArrays) {
//         const point = JSON.parse(pointArray.pointArray);
//         console.log(point);
//         UserDetail.update(
//             {
//                 moodPoint:
//                     pointArray.moodPoint +
//                     point.reduce(function add(sum, currValue) {
//                         return sum + currValue;
//                     })
//             },
//             {
//                 where: { detailId: pointArray.detailId }
//             }
//         );
//     }
// };

// totalLikeCount();

const scheduleHandller = async () => {};

module.exports = {
    schedule,
    createHotPost
};
