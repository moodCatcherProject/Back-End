const userRepository = require('../repositories/user.repository');
const authRepository = require('../repositories/auth.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * 유저 정보 조회
 * @param {number} userId
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const getUser = async (userId) => {
    if (!userId) throw new exception.NotFoundException('유저 정보 없음');
    const userStatus = await userRepository.getUserStatusByUserId(userId);
    const authData = await userRepository.findAuth(userId);

    if (authData.provider === 'local') {
        userStatus.imgUrl = process.env.S3_STORAGE_URL + userStatus.imgUrl;
    }

    return userStatus;
};

/**
 * 유저 정보 수정
 * @param {number} userId
 * @param {string} nickname
 * @param {string} gender
 * @param {string} age
 * @param {string} imageFileName
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const updateUser = async (userId, nickname, gender, age, imageFileName) => {
    new exception.isString({ nickname }).value;
    new exception.isString({ gender }).value;
    new exception.isString({ age }).value;

    const checkNickname = /^(?=.*[a-zA-Z0-9가-힣])[a-zA-Z0-9가-힣]{2,16}$/;
    if (checkNickname.test(nickname) == false) {
        throw new exception.BadRequestException('닉네임 유효성 에러');
    }

    if (gender !== '남자' && gender !== '여자') {
        throw new exception.BadRequestException('성별 유효성 에러');
    }

    if (age !== '10대' && age !== '20대' && age !== '30대' && age !== '40대' && age !== '50대') {
        throw new exception.BadRequestException('나이 유효성 에러');
    }

    //변경할 닉네임 값을 기존 닉네임과 동일하게 입력했을 때는 닉네임 중복 확인 안함.
    const user = await userRepository.getUserStatusByUserId(userId);
    if (!user) throw new exception.NotFoundException('유저 정보 없음');
    if (nickname !== user.nickname) {
        const ExistsNickname = await userRepository.findByNickname(nickname);
        if (ExistsNickname) {
            throw new exception.BadRequestException('닉네임 중복확인 실패');
        }
    }

    //성별을 수정할 때 grade도 변경하기(moody인 경우 제외/(예)man 1에서 woman 1로 변경)
    let grade = user.grade;
    if (gender !== user.gender && user.grade.split(' ')[0] !== 'moody') {
        if (gender === '남자') grade = 'man ' + user.grade.split(' ')[1];
        else grade = 'woman ' + user.grade.split(' ')[1];
    }

    await authRepository.updateNicknameAgeGender(nickname, age, gender, userId, grade);

    const updateUser = await userRepository.updateUserImage(userId, imageFileName);
    const authData = await userRepository.findAuth(userId);

    if (authData.provider === 'local') {
        updateUser.imgUrl = process.env.S3_STORAGE_URL + updateUser.imgUrl;
    }

    return updateUser;
};

/**
 *
 * @param {number} userId
 * @param {string} profileIcon
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string, gender:string, age:string, moodPoint:number, repPostId:number, isExistsNotice:boolean } | null>}
 */
const updateProfileIcon = async (userId, profileIcon) => {
    new exception.isString({ profileIcon }).value;

    const user = await userRepository.getUserStatusByUserId(userId);
    if (!user) throw new exception.NotFoundException('유저 정보 없음');

    if (user.gender === '남자' && profileIcon !== 'man' && profileIcon !== 'moody')
        throw new exception.BadRequestException('profileIcon 값은 man, moody만 유효합니다.');
    if (user.gender === '여자' && profileIcon !== 'woman' && profileIcon !== 'moody')
        throw new exception.BadRequestException('profileIcon 값은 woman, moody만 유효합니다.');

    let grade = user.grade;
    if (profileIcon === 'man') grade = 'man ' + user.grade.split(' ')[1];
    if (profileIcon === 'woman') grade = 'woman ' + user.grade.split(' ')[1];
    if (profileIcon === 'moody') grade = 'moody ' + user.grade.split(' ')[1];

    const userStatus = await userRepository.updateGrade(userId, grade);
    const authData = await userRepository.findAuth(userId);

    if (authData.provider === 'local') {
        userStatus.imgUrl = process.env.S3_STORAGE_URL + userStatus.imgUrl;
    }

    return userStatus;
};

/**
 * 회원탈퇴
 * @param {number} userId
 * @returns
 */
const deleteUser = async (userId) => {
    await userRepository.deleteUser(userId);
    return;
};

module.exports = {
    getUser,
    updateUser,
    updateProfileIcon,
    deleteUser
};
