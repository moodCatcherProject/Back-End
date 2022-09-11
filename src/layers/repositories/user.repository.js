const { User, UserDetail, Auth } = require('../../sequelize/models');

/**
 * User 테이블에서 UserDetail 테이블을 참조하여 userId 값이 일치하는 data 반환
 * @param {number} userId
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const getUserStatusByUserId = async (userId) => {
    const userStatus = await User.findOne({
        where: { userId },
        raw: true,
        include: [
            {
                model: UserDetail,
                attributes: { exclude: ['detailId'] },
                raw: true
            }
        ]
    });

    return {
        userId: userStatus['userId'],
        nickname: userStatus['nickname'],
        imgUrl: userStatus['imgUrl'],
        grade: userStatus['grade'],
        gender: userStatus['UserDetail.gender'],
        age: userStatus['UserDetail.age'],
        moodPoint: userStatus['UserDetail.moodPoint'],
        repPostId: userStatus['UserDetail.repPostId'],
        isExistsNotice: userStatus['UserDetail.isExistsNotice']
    };
};

/**
 * @param { string } nickname
 * @returns User 테이블에서 nickname 한개를 찾음
 */
const findByNickname = async (nickname) => {
    const findByNickname = await User.findOne({ where: { nickname } });
    return findByNickname;
};

/**
 * User 테이블에서 userId 값이 일치하는 data의 imgUrl 업데이트 후 user data 반환
 * @param {number} userId
 * @param {string} imageFileName
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const updateUserImage = async (userId, imageFileName) => {
    await User.update({ imgUrl: imageFileName }, { where: { userId } });

    return await getUserStatusByUserId(userId);
};

/**
 * User 테이블에서 userId 값이 일치하는 data의 grade 업데이트 후 user data 반환
 * @param {number} userId
 * @param {string} grade
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const updateGrade = async (userId, grade) => {
    await User.update({ grade }, { where: { userId } });

    return await getUserStatusByUserId(userId);
};

/**
 * User 테이블에서 userId 값이 일치하는 data 삭제
 * @param {number} userId
 */
const deleteUser = async (userId) => {
    await User.destroy({ where: { userId } });
};

//FUNCTION(권영)
const findAuth = async (userId) => {
    const authData = await Auth.findByPk(userId);
    return authData;
};
module.exports = {
    getUserStatusByUserId,
    findByNickname,
    updateUserImage,
    updateGrade,
    deleteUser,

    findAuth
};
