const { User, UserDetail, Auth } = require('../../sequelize/models');
const exception = require('../exceptModels/_.models.loader');

/**
 * User 테이블에서 UserDetail 테이블을 참조하여 userId 값이 일치하는 data 반환
 * @param {number} userId
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const getUserStatusByUserId = async (userId) => {
    try {
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
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * @param { string } nickname
 * @returns User 테이블에서 nickname 한개를 찾음
 */
const findByNickname = async (nickname) => {
    try {
        const findByNickname = await User.findOne({ where: { nickname } });
        return findByNickname;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * User 테이블에서 userId 값이 일치하는 data의 imgUrl 업데이트 후 user data 반환
 * @param {number} userId
 * @param {string} imageFileName
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const updateUserImage = async (userId, imageFileName) => {
    try {
        await User.update({ imgUrl: imageFileName }, { where: { userId } });

        return await getUserStatusByUserId(userId);
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * User 테이블에서 userId 값이 일치하는 data의 grade 업데이트 후 user data 반환
 * @param {number} userId
 * @param {string} grade
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const updateGrade = async (userId, grade) => {
    try {
        await User.update({ grade }, { where: { userId } });

        return await getUserStatusByUserId(userId);
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

/**
 * User 테이블에서 userId 값이 일치하는 data 삭제
 * @param {number} userId
 */
const deleteUser = async (userId) => {
    try {
        await User.destroy({ where: { userId } });
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

//FUNCTION(권영)
const findAuth = async (userId) => {
    try {
        const authData = await Auth.findByPk(userId);
        return authData;
    } catch (err) {
        throw new exception.UnhandleMysqlSequelizeError(`UnhandleMysqlSequelizeError: ${err}`);
    }
};

module.exports = {
    getUserStatusByUserId,
    findByNickname,
    updateUserImage,
    updateGrade,
    deleteUser,

    findAuth
};
