const { User, UserDetail, Post, Item, Like, HotPost } = require('../../sequelize/models');
const exception = require('../exceptModels/_.models.loader');

const sequelize = require('sequelize');
const Op = sequelize.Op;
//CRUD
// // POST
/**
 *
 * @param {int} userId
 * @param {string} title
 * @param {string} content
 *
 * @returns 게시물 정보를 만들고 나서 그 게시물의 데이터 반환
 */
const createPost = async (userId, title, content, gender) => {
    return await Post.create({
        userId,
        title,
        content,
        gender,
        imgUrl: 'default'
    });
};

/**
 * user가 좋아요를 누른 적이 있는 Post 조회 : Post 테이블에서 Like 테이블을 참조하여 postId 값이 일치하는 data 반환(likeStatus는 postId, userId가 일치하는 값 반환)
 * @param { number } postId
 * @param { number } userId
 * @returns { Promise<{ postId:number, title:string, content:string, userId:number, imgUrl:string, likeCount:number, createdAt:date, Likes.likeStatus:boolean } | null>}
 */
const findPostDetailWithLikeStatus = async (postId, userId) => {
    const post = await Post.findOne({
        where: { postId, delete: false },
        attributes: { exclude: ['gender'] },
        include: [
            {
                model: Like,
                where: { postId, userId },
                attributes: ['likeStatus']
            }
        ]
    });

    return post;
};

/**
 *
 * user가 좋아요를 누른 적이 없는 Post 조회 : Post 테이블에서 postId 값이 일치하는 data 반환(likeStatus는 0)
 * @param { number } postId
 * @returns { Promise<{ postId:number, title:string, content:string, userId:number, imgUrl:string, likeCount:number, createdAt:date, Likes.likeStatus:boolean } | null>}
 */
const findPostDetail = async (postId) => {
    const post = await Post.findOne({
        where: { postId, delete: false },
        attributes: { exclude: ['gender'] },
        include: [
            {
                model: Like
            }
        ]
    });

    post.dataValues.Likes.push({ dataValues: { likeStatus: false } });

    return post;
};

/**
 *
 * @param {number} postId
 * @returns 해당 postId의 게시물 데이터
 */
const findPost = async (postId) => {
    return await Post.findOne({
        where: { postId, delete: false }
    });
};
/**
 *
 * @param {number} page 페이지 네이션을 위한 페이지 번호
 * @param {number} count 출력되는 게시물 수
 * @param {string} orderKey 정렬의 기준 ex : createdAt, likeCount 등등
 * @param {string} order 정렬 방법 : DESC, ASC ...
 * @param {string} gender 성별을 기준으로 게시물을 출력할 때 ex : 여자 작성자의 게시물등
 *
 * @returns
 */
const findAllPosts = async (page, count, orderKey, order, gender) => {
    return await Post.findAll({
        offset: count * (page - 1),
        limit: count,
        order: [[orderKey, order]],
        where: { gender, delete: false }
    });
};

/**
 *
 * @param {number} userId 이 유저의 마이페이지를 출력합니다.
 * @param {number} page 페이지 네이션을 위한 페이지 번호
 * @param {number} count 출력되는 게시물 수
 * @param {string} orderKey 정렬의 기준 ex : createdAt, likeCount 등등
 * @param {string} order 정렬 방법 : DESC, ASC ...
 * @param {string} gender 성별을 기준으로 게시물을 출력할 때 ex : 여자 작성자의 게시물등
 * @returns userId의 유저가 작성한 게시물
 */
const findMyPage = async (userId, page, count, orderKey, order) => {
    return await Post.findAll({
        where: { userId, delete: false },
        offset: count * (page - 1),
        limit: count,
        order: [[orderKey, order]]
    });
};
/**
 *
 * @param {number} userId 이 유저가 좋아요를 한 게시물을 출력해 줄거임.
 * @param {number} page 페이지 네이션을 위한 페이지 번호
 * @param {number} count 출력되는 게시물 수
 * @param {string} orderKey 정렬의 기준 ex : createdAt, likeCount 등등
 * @param {string} order 정렬 방법 : DESC, ASC ...
 * @param {string} gender 성별을 기준으로 게시물을 출력할 때 ex : 여자 작성자의 게시물등
 * @returns userId의 유저가 좋아요를 한 게시물 데이터
 */
const findLikePage = async (userId, page, count, orderKey, order, gender) => {
    const likeIdData = await Like.findAll({
        where: { userId, likeStatus: true },
        order: [['createdAt', 'DESC']]
    });
    const likeIdArr = likeIdData.map((p) => {
        return p.postId;
    });

    return await Post.findAll({
        where: { postId: { [Op.in]: likeIdArr } },
        offset: count * (page - 1),
        limit: count,
        order: [[orderKey, order]]
    });
};

/**
 *
 * @param {string} keyword 이 단어로 검색을 해줄 겁니다.
 * @param {number} page 페이지 네이션을 위한 페이지 번호
 * @param {number} count 출력되는 게시물 수
 * @param {string} orderKey 정렬의 기준 ex : createdAt, likeCount 등등
 * @param {string} order 정렬 방법 : DESC, ASC ...
 * @param {string} gender 성별을 기준으로 게시물을 출력할 때 ex : 여자 작성자의 게시물등
 * @returns 키워드로 제목에서 검색해 게시물 데이터
 */
const findSearchTitleKeyword = async (keyword, page, count, orderKey, order, gender) => {
    return await Post.findAll({
        offset: count * (page - 1),
        limit: count,
        where: {
            gender,
            title: {
                [Op.like]: '%' + keyword + '%'
            },
            delete: false
        },
        order: [[orderKey, order]]
    });
};
/**
 *
 * @param {string} keyword 이 키워드를 이용해 작성자 검색
 * @param {number} page 페이지 네이션을 위한 페이지 번호
 * @param {number} count 출력되는 게시물 수
 * @returns 키워드로 작성자를 검색해 그 작성자의 대표게시물 데이터
 */
const findSearchWriterKeyword = async (keyword, page, count) => {
    const userData = await User.findAll({
        offset: count * (page - 1),
        limit: count,
        where: {
            nickname: {
                [Op.like]: '%' + keyword + '%'
            }
        }
    });
    console.log(userData);
    const result = [];

    for (let user of userData) {
        const rep = await findRepPost(user.userId);

        result.push(await findPost(rep.postId));
    }
    return result;
};

const findAlgorithmPost = async (page, count) => {
    return await Post.findAll({
        offset: count * (page - 1),
        limit: count,
        order: [['likeCount', 'DESC']],
        where: {
            createdAt: {
                [Op.lt]: new Date(),
                [Op.gt]: new Date(new Date() - 24 * 60 * 60 * 1000)
            },
            delete: false
        }
    });
};

/**
 *
 * @param {number} postId
 * @returns postId의 게시물의 좋아요 숫자
 */
const findLikeNumByPostId = async (postId) => {
    return await Like.findAndCountAll({
        where: { postId }
    });
};
/**
 *
 * @param {number} postId
 * @param {string} title
 * @param {string} content
 * @returns 업데이트 된 게시물 데이터
 */
const updatePost = async (postId, title, content, gender) => {
    try {
        await Post.update(
            {
                title,
                content,
                gender
            },
            {
                where: { postId }
            }
        );
    } catch (err) {
        throw new exception.NotFoundException('해당 게시물이 없음.');
    }
    return await findPost(postId);
};

/**
 *
 * @param {number} postId
 * @return 없음 , 실패시 404 에러
 */
const deletePost = async (postId) => {
    try {
        await Post.update(
            {
                delete: true
            },
            {
                where: { postId }
            }
        );
    } catch (err) {
        throw new exception.NotFoundException('해당 게시물이 없음.');
    }
};
// // POST ADD

/**
 *
 * @param {number} userId
 * @returns userId의 유저의 대표게시물의 데이터
 */
const findRepPost = async (userId) => {
    const repPostIdAttr = await UserDetail.findOne({
        where: { detailId: userId },
        attributes: ['repPostId']
    });

    return await Post.findByPk(repPostIdAttr.repPostId);
};

/**
 *
 * @param {number} userId
 * @param {number} repPostId
 * @returns 업데이트 된 대표 게시물의 postId
 */
const updateRepPost = async (userId, repPostId) => {
    try {
        await UserDetail.update(
            {
                repPostId
            },
            {
                where: { detailId: userId }
            }
        );
        const repPostIdData = await UserDetail.findOne({
            where: { detailId: userId }
        });
        return repPostIdData.repPostId;
    } catch (err) {
        throw new exception.NotFoundException('게시물이 없음.');
    }
};

// //ITEM

/**
 *
 * @param {number} postId
 * @param {object} item
 * @returns item데이터
 */
const createItem = async (postId, item) => {
    const { brand, name, imgUrl, price } = item;
    return await Item.create({
        postId,
        brand,
        name,
        imgUrl,
        price
    });
};

/**
 * Item 테이블에서 postId 값이 일치하는 data 배열 반환
 * @param {number} postId
 * @returns { Promise<{ brand:string, name:string, price:string, imgUrl:string } | null>}
 */
const findItems = async (postId) => {
    return await Item.findAll({
        where: { postId },
        attributes: { exclude: ['itemId', 'postId'] },
        raw: true
    });
};

/**
 *
 * @param {number} postId
 * @param {object} item
 * @returns 수정 된 item 데이터
 */
const updateItem = async (postId, item) => {
    try {
        const { brand, name, imgUrl, price } = item;
        await Item.update(
            {
                brand,
                name,
                imgUrl,
                price
            },
            {
                where: { postId }
            }
        );
        return await Item.findOne({ where: { postId } });
    } catch (err) {
        throw new exception.NotFoundException('해당 게시물이 없음.');
    }
};

// // IMAGE
/**
 *
 * @param {number} postId
 * @param {string} imgUrl
 * @desc imgUrl은 req.file.key 값을 넣어야 함!
 * @returns 이미지를 업데이트 한 게시물의 데이터
 */
const updateImage = async (postId, imgUrl) => {
    await Post.update(
        {
            imgUrl
        },
        {
            where: { postId }
        }
    );
    //update를 하면 게시물의 정보가 아닌 postId를 return 해주는 것 같아 추가.

    return await findPost(postId);
};
// // NOTICE
const isExistNotice = async (userId) => {
    return await UserDetail.findOne({
        where: { detailId: userId },
        attributes: ['isExistsNotice']
    });
};

/**
 * postId가 일치하는 게시글의 likeCount를 variation(1 또는 -1)만큼 증감
 * todayLikeCount를 todayVariation(1 또는 -1)만큼 증감 후 exLikeCount, likeCount 배열 반환
 * @param {number} postId
 * @returns 해당 게시글의 plusLikeCount 함수 실행 전과 실행 후 likeCount의 배열
 */
const updateLikeCount = async (postId, variation, todayVariation) => {
    const post = await findPost(postId);

    const exLikeCount = post.likeCount;
    const exTodayLikeCount = post.todayLikeCount;

    const likeCount = exLikeCount + variation;
    const todayLikeCount = exTodayLikeCount + todayVariation;

    await Post.update({ likeCount, todayLikeCount }, { where: { postId } });

    const data = [exLikeCount, likeCount];

    return data;
};

/**
 * HotPost 테이블에서 모든 data 반환
 * @returns { Promise<[{ postId:number, imgUrl:string }, { postId:number, imgUrl:string }, { postId:number, imgUrl:string }] | null>}
 */
const findHotPosts = async () => {
    return await HotPost.findAll();
};

//FUNCTION

module.exports = {
    createPost,
    updatePost,
    findPostDetailWithLikeStatus,
    findPostDetail,
    findPost,
    findAllPosts,
    deletePost,

    findRepPost,
    updateRepPost,
    findAlgorithmPost,

    findMyPage,
    findLikePage,
    findSearchTitleKeyword,
    findSearchWriterKeyword,
    findLikeNumByPostId,

    createItem,
    findItems,
    updateItem,

    updateImage,

    isExistNotice,

    updateLikeCount,
    findHotPosts
};
