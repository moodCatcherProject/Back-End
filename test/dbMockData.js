const {
    Post,
    Auth,
    Like,
    User,
    UserDetail,
    StartMessage,
    MoodPoint
} = require('../src/sequelize/models');
const bcrypt = require('bcrypt');
const fs = require('fs');

const createPostMul = async (title, content, userId, i) => {
    const genderData = await UserDetail.findOne({
        where: { detailId: userId },
        raw: true,
        attributes: ['gender']
    });

    await Post.create({
        title: `${title} ${i} 번 `,
        content: `${content} ${i}번 `,
        imgUrl: 'post/1662125456004.jpg',
        userId,
        gender: genderData.gender
    });
};

const createUser = async (email, password, i) => {
    const emailSplit = email.split('@');
    const random = Math.random();
    await User.create({
        nickname: `테스트 닉네임 ${i}`,

        imgUrl: `http://${i}번째 사진`
    });
    await Auth.create({
        email: `${emailSplit[0]}${i}@${emailSplit[1]}`,
        password: await bcrypt.hash(password, 12),
        provider: 'local',
        userId: i
    });
    await UserDetail.create({
        userId: i,
        gender: random < 0.5 ? '남자' : '여자'
    });
};

const createLike = async (userId, postId) => {
    for (let i = 1; i <= postId; i++) {
        await Like.create({
            userId,
            postId: i
        });
    }
};

const updateAccLike = async (postId) => {
    const accLike = await Like.findAndCountAll({
        where: { postId }
    });
    console.log(accLike.count);
    await Post.update(
        {
            likeCount: accLike.count
        },
        {
            where: { postId }
        }
    );
};

const createStartMsg = () => {
    const startMessage = fs.readFileSync('startMsg.txt', 'utf8').split(`\n`);
    for (let i = 0; i < startMessage.length; i++) {
        StartMessage.create({ message: startMessage[i] });
    }
};

const createTestDatabase = async (req, res, next) => {
    try {
        for (let i = 1; i <= 5; i++) {
            await createUser('test@naver.com', 'testPassword', i);
        }
        for (let j = 1; j <= 10; j++) {
            createPostMul('테스트용 제목', '내용입니다. 테스트용', 1, j);
        }
        for (let j = 1; j <= 10; j++) {
            await createPostMul(
                '2번유저가 만든 테스트용 제목',
                '2번 유저가 만든 내용입니다. 테스트용',
                2,
                j
            );
        }
        for (let j = 1; j <= 8; j++) {
            await createPostMul(
                '3번유저가 만든 테스트용 제목',
                '3번 유저가 만든 내용입니다. 테스트용',
                3,
                j
            );
        }
        for (let j = 1; j <= 5; j++) {
            await createPostMul(
                '4번유저가 만든 테스트용 제목',
                '4번 유저가 만든 내용입니다. 테스트용',
                4,
                j
            );
        }
        await createLike(1, 5);
        await createLike(2, 8);
        await createLike(3, 11);
        await createLike(4, 12);
        await createLike(5, 20);
        for (let i = 1; i <= 20; i++) {
            await updateAccLike(i);
        }
        createStartMsg();
        res.status(200).send('데이터 베이스 생성!');
    } catch (err) {
        next(err);
    }
};
module.exports = { createTestDatabase };
