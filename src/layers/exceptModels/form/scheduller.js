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
 * 5. delete 가 true인 게시물을 삭제하기
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
const { User, UserDetail, Post, HotPost, Notice } = require('../../../sequelize/models');
const exception = require('../_.models.loader');
const sequelize = require('sequelize');
const Op = sequelize.Op;
//한국시간으로 새벽 00시 00분 00초 마다 실행 (우분투에서는 9시간의 시차가 있어보여요.)
schedule.scheduleJob('* * * * * *', () => {
    scheduleHandller();
});

const createHotPost = async () => {
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

    try {
        // 랭킹 등재 moodPoints 적립
        exception.MoodPoint.whenInRankingMyPost(hotPosts[0].userId, hotPosts[0].postId);
        exception.MoodPoint.whenInRankingMyPost(hotPosts[1].userId, hotPosts[1].postId);
        exception.MoodPoint.whenInRankingMyPost(hotPosts[2].userId, hotPosts[2].postId);
    } catch (err) {
        console.log(err);
    }
};

const totalLikeCount = async () => {
    const pointArrays = await UserDetail.findAll({
        attributes: ['detailId', 'moodPoint', 'pointArray'],
        raw: true
    });
    console.log(pointArrays);
    for (let pointArray of pointArrays) {
        const point = JSON.parse(pointArray.pointArray);
        try {
            UserDetail.update(
                {
                    moodPoint:
                        pointArray.moodPoint +
                        point.reduce(function add(sum, currValue) {
                            return sum + currValue;
                        })
                },
                {
                    where: { detailId: pointArray.detailId }
                }
            );
        } catch (err) {
            continue;
        }
    }
};

const updateGrade = async () => {
    // User, UserDetail 테이블에서 전체유저의 grade, detailId, moodPoint data 배열로 반환
    try {
        const pointArrays = await User.findAll({
            attributes: ['grade'],
            raw: true,
            include: [
                {
                    model: UserDetail,
                    attributes: ['detailId', 'moodPoint'],
                    raw: true
                }
            ]
        });

        // for of 문을 돌며 유저의 moodPoint에 맞는 grade로 data update
        for (let pointArray of pointArrays) {
            const moodPoint = pointArray['UserDetail.moodPoint'];
            const detailId = pointArray['UserDetail.detailId'];
            const gradeStr = pointArray['grade'].split(' ')[0];

            //switch 조건문의 case에는 상수값만 올 수 있어 변수, 비교식 등에는 사용할 수 없어서 else if 조건문 선택
            let gradeNum;
            if (moodPoint < 1000) {
                gradeNum = ' 1';
            } else if (moodPoint < 3000) {
                //else if(1000<=moodPoint<3000)으로 하면 1000보다 큰지만 확인하고 조건문 참으로 인정,,,
                gradeNum = ' 2';
            } else if (moodPoint < 6000) {
                gradeNum = ' 3';
            } else if (moodPoint < 10000) {
                gradeNum = ' 4';
            } else if (moodPoint >= 10000) {
                gradeNum = ' 5';
            }

            await User.update(
                {
                    grade: gradeStr + gradeNum
                },
                {
                    where: { userId: detailId }
                }
            );
        }
    } catch (err) {
        console.log(err);
    }
};

const likeCountInit = () => {
    UserDetail.update(
        {
            pointArray: '[]'
        },
        {
            where: {}
        }
    );
};

const deleteNotice = () => {
    Notice.destroy({
        where: {
            createdAt: {
                [Op.lt]: new Date(new Date() - 2 * 24 * 60 * 60 * 1000)
            }
        }
    });
};

const deletePost = () => {
    Post.destroy({
        where: {
            delete: true
        }
    });
};

const scheduleHandller = async () => {
    try {
        await totalLikeCount(); // 오늘 획득한 좋아요를 집계하고
        likeCountInit(); // pointArray를 모두 0으로 초기화 함.
        deletePost(); // delete 가 true인 게시물들 삭제
        updateGrade(); // moodPoint에 따라 grade update.
        deleteNotice(); // 2일 이상 지난 알림을 모두 삭제
        createHotPost(); // hot posts 산출
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    schedule
};
