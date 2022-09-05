const { Post, Auth, Like, User, UserDetail } = require('../src/sequelize/models');
const bcrypt = require('bcrypt');

const createPostMul = async (title, content, userId, i) => {
    await Post.create({
        title: `${title} ${i} 번 `,
        content: `${content} ${i}번 `,
        imgUrl: 'defalt',
        userId
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
            accLike: accLike.count
        },
        {
            where: { postId }
        }
    );
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
        await createLike(1, 5);
        await createLike(2, 8);
        await createLike(3, 11);
        await createLike(4, 12);
        await createLike(5, 20);
        for (let i = 1; i <= 20; i++) {
            await updateAccLike(i);
        }
        res.status(200).send('데이터 베이스 생성!');
    } catch (err) {
        next(err);
    }
};
module.exports = { createTestDatabase };
