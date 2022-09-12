const postRepository = require('../repositories/post.repository');
const likeRepository = require('../repositories/like.repository');
const userRepository = require('../repositories/user.repository');
const exception = require('../exceptModels/_.models.loader');

//CRUD
// // POST
/**
 *
 * @param {string} title
 * @param {string} content
 * @param {Array} items
 * @returns 생성 된 게시물의 데이터
 */
const createPost = async (userId, title, content, gender) => {
    const createPostData = await postRepository.createPost(userId, title, content, gender);
    title = new exception.isString({ title }).trim;

    exception.MoodPoint.whenCreatePost(userId, createPostData.postId);
    return createPostData;
};

/**
 * page , count 는 항상 필수 (default값을 정해도 좋을 것 같음.)
 * order 는 기본적으로는 recent 값으로 줘도 좋을 것 같음.
 * == 여기까지 기본으로 같이 오는 값
 * type=my&userId=1 이 유저아이디의 내가 쓴 게시물 출력
 * type=like 로그인한 유저가 좋아요를 누른 게시물 출력
 * type=search&keyword="조권영"&sort=title 제목으로 '조권영'을 검색
1. 전체게시물 :
    1. 남자 2. 여자
        => 최신순 인기순
2. 나의 옷장(게시물) 
    => 최신순 인기순 
3. 검색 결과 페이지 
    1. 남자 2. 여자
        => 최신순 인기순 
4. 검색 알고리즘
    만약 남녀 값이 오지 않으면 전체 출력
 * 
 */

/**
 * @desc 매개변수의 조합에 따라 보여주는 게시물이 달라짐.
 * @param {number} userId 다른 사람의 마이페이지 출력 시
 * @param {*} keyword search 검색기능을 이용할 때 필요한 키워드
 * @param {*} sort title, writer
 * @param {*} type my : 마이페이지, like : 내가 좋아요 한 페이지, search : 검색 결과 페이지
 * @param {*} gender '남자', '여자' , ['남자, '여자']
 * @param {*} page '현재의 페이지'
 * @param {*} count ' 한 페이지 출력 개수'
 * @param {*} order recent : 최신 순, popular : 인기 순
 * @returns 게시물 데이터
 */
const findAllPosts = async (
    userId,
    keyword, //검색결과
    sort, // 검색결과 title, writer
    type = 'all',
    gender = ['남자', '여자'],
    page = 1,
    count = 8,
    order = 'recent'
) => {
    // const data = await postRepository.findSearchWriterKeyword('네임 1');
    // console.log(data);
    // const testD = data.map((e) => e.get({ plain: true }));
    // console.log(testD);
    let data, orderKey;
    switch (order) {
        case 'recent': {
            orderKey = 'createdAt';
            order = 'DESC';

            break;
        }
        case 'popular': {
            orderKey = 'likeCount';
            order = 'DESC';

            break;
        }
    }

    switch (type) {
        case 'my': {
            //유저의 정보, 이 유저가 작성한 게시물 Posts 배열, UserDetail.gender

            data = await postRepository.findMyPage(userId, page, count, orderKey, order);
            try {
                if (userId !== data[0].userId) {
                    exception.MoodPoint.whenLookMyCloser(data[0].userId);
                }
            } catch (err) {}
            break;
        }
        case 'like': {
            data = await postRepository.findLikePage(userId, page, count, orderKey, order, gender);

            break;
        }
        case 'search': {
            switch (sort) {
                case 'title': {
                    data = await postRepository.findSearchTitleKeyword(
                        keyword,
                        page,
                        count,
                        orderKey,
                        order,
                        gender
                    );

                    break;
                }
                case 'writer': {
                    data = await postRepository.findSearchWriterKeyword(keyword, page, count);

                    break;
                }
            }

            break;
        }
        case 'alg': {
            data = await postRepository.findAlgorithmPost(page, count);
            break;
        }
        default: {
            data = await postRepository.findAllPosts(page, count, orderKey, order, gender);

            break;
        }
    }
    try {
        data = data.map((e) => e.get({ plain: true }));
    } catch (err) {
        throw new exception.NotFoundException('검색내용 없음');
    }

    return data;
};

/**
 * 게시물 상세 조회
 * @param {number} postId
 * @param {number} userId
 * @returns { Promise<{ post: {postId:number, title:string, content:string, userId:number, imgUrl:string,
 *  likeCount:number, createdAt:date, likeStatus:string }, items: [{ brand:string, name:string, price:string, imgUrl:string }] } | null>}
 */
const findOnePost = async (postId, userId) => {
    const isExistsPost = await postRepository.findPost(postId);
    if (!isExistsPost) throw new exception.NotFoundException('해당 게시물 없음');

    let post;
    const isExistsLike = await likeRepository.findLikeByUserIdAndPostId(userId, postId);
    if (isExistsLike) {
        post = await postRepository.findPostDetailWithLikeStatus(postId, userId);
    } else {
        post = await postRepository.findPostDetail(postId);
    }
    const items = await postRepository.findItems(postId);

    return {
        post: {
            userId: post['userId'],
            postId: post['postId'],
            title: post['title'],
            content: post['content'],
            imgUrl: process.env.S3_STORAGE_URL + post['imgUrl'],
            likeCount: post['likeCount'],
            createdAt: post['createdAt'],
            likeStatus: post.Likes[0].dataValues.likeStatus
        },
        items
    };
};

const createHotPosts = async () => {
    return await postRepository.createHotPost();
};

/**
 * 인기 게시물 조회
 * @returns
 */
const findHotPosts = async () => {
    const hotPosts = await postRepository.findHotPosts();

    console.log(hotPosts);

    return hotPosts;
};

/**
 *
 * @param {string} title
 * @param {string} content
 *
 * @returns 업데이트 된 게시물의 데이터
 */
const updatePost = async (userId, postId, title, content, gender) => {
    title = new exception.isString({ title }).trim;
    await isExistPostOfUser(userId, postId);
    const createPostData = await postRepository.updatePost(postId, title, content, gender);

    return createPostData;
};

/**
 *
 * @param {number} userId
 * @param {number} postId
 * @returns 없음.
 */
const deletePost = async (userId, postId) => {
    await isExistPostOfUser(userId, postId);
    postRepository.deletePost(postId);
    return;
};

// // // POST ADD
/**
 *
 * @param {number} userId
 * @param {number} repPostId
 * @returns 대표 게시물로 지정된 postId
 */
const updateRepPost = async (userId, repPostId) => {
    await isExistPostOfUser(userId, repPostId);
    return await postRepository.updateRepPost(userId, repPostId);
};

/**
 * 대표 게시물 조회
 * @param {number} userId
 * @returns { Promise<{ postId:number, userId:number, imgUrl:string, title:string, content:string, likeCount:number, createdAt:date } | null>}
 */
const findRepPost = async (userId) => {
    const userStatus = await userRepository.getUserStatusByUserId(userId);
    if (!userStatus.repPostId) {
        return {};
    }

    const repPost = await postRepository.findPost(userStatus.repPostId);

    return {
        postId: repPost['postId'],
        userId: repPost['userId'],
        imgUrl: process.env.S3_STORAGE_URL + repPost['imgUrl'],
        title: repPost['title'],
        content: repPost['content'],
        likeCount: repPost['likeCount'],
        createdAt: repPost['createdAt']
    };
};

// //ITEM
/**
 *
 * @param {number} postId
 * @param {Array} items
 * @desc items는 배열 그대로 받아 repository의 함수를 배열 수만큼 실행합니다.
 * @returns 생성 된 아이템들의 데이터
 */
const createItem = async (userId, postId, items) => {
    const createItemData = [];
    for (let item of items) {
        createItemData.push(await postRepository.createItem(postId, item));
        exception.MoodPoint.whenCreateItem(userId);
    }
    console.log();
    return createItemData;
};

/**
 *
 * @param {number} postId
 * @param {Array} items
 * @desc items는 배열 그대로 받아 repository의 함수를 배열 수만큼 실행합니다.
 * @returns 업데이트 된 아이템의 데이터
 */
const updateItem = async (postId, items) => {
    const updateItemData = [];
    for (let item of items) {
        updateItemData.push(await postRepository.updateItem(postId, item));
    }
    return updateItemData;
};

// // IMAGE
/**
 *
 * @param {number} postId
 * @param {string} imageFileName
 * @returns 업데이트 된 이미지가 들어간 게시물 데이터
 */

const updateImage = async (userId, postId, imageFileName) => {
    if (!imageFileName) throw new exception.BadRequestException('게시물 이미지가 빈 값');
    await isExistPostOfUser(userId, postId);
    const updateImageData = await postRepository.updateImage(postId, imageFileName);
    updateImageData.imgUrl = process.env.S3_STORAGE_URL + updateImageData.imgUrl;
    return updateImageData;
};

// // NOTICE
const isExistNotice = async (userId) => {
    const isExistNoticeData = await postRepository.isExistNotice(userId);
    return isExistNoticeData.isExistsNotice;
};

//FUNGTION
const findLikeStatus = async (userId, postId) => {
    const likeStatusData = await likeRepository.findLikeByUserIdAndPostId(userId, postId);
    if (!likeStatusData) return false;
    return likeStatusData.likeStatus;
};

/**
 *
 * @param {number} userId
 * @param {number} postId
 * @returns 해당 게시물이 로그인한 사용자의 게시물인지 확인
 * 사용자의 게시물이 맞으면 true 아니면 401에러
 */
const isExistPostOfUser = async (userId, postId) => {
    const postData = await postRepository.findPost(postId);

    if (userId === postData.userId) {
        return true;
    } else {
        throw new exception.UnauthorizedException('게시물의 작성자가 아님.');
    }
};

module.exports = {
    createPost,
    findAllPosts,
    findOnePost,
    createHotPosts,
    findHotPosts,
    updatePost,
    deletePost,

    findRepPost,
    updateRepPost,

    createItem,
    updateItem,

    updateImage,

    findLikeStatus,
    isExistNotice
};
