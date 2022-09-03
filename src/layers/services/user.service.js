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

    return userStatus;
};

/**
 * 유저 정보 수정
 * @param {number} userId
 * @param {string} nickname
 * @param {string} gender
 * @param {string} age
 * @param {string} imageFileName
 * @returns { Promise<{userId:number, nickname:string, imgUrl:string, grade:string} | null>}
 */
const updateUser = async (userId, nickname, gender, age, imageFileName) => {
    new exception.isString({ nickname }).value;
    new exception.isString({ gender }).value;
    new exception.isString({ age }).value;
    if (!imageFileName) throw new exception.BadRequestException('이미지가 빈 값');

    const checkNickname = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
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
        const ExistsNickname = await authRepository.findByNickname(nickname);
        if (ExistsNickname) {
            throw new exception.BadRequestException('닉네임 중복 확인 실패!');
        }
    }

    await authRepository.updateNicknameAgeGender(nickname, age, gender, userId);

    const updateUser = await userRepository.updateUserImage(userId, imageFileName);

    return updateUser;
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
    deleteUser
};
