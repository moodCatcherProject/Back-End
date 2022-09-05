const postRepository = require('../repositories/post.repository');
const exception = require('../exceptModels/_.models.loader');

/**
 * page , count 는 항상 필수 (default값을 정해도 좋을 것 같음.)
 * order 는 기본적으로는 recent 값으로 줘도 좋을 것 같음.
 * == 여기까지 기본으로 같이 오는 값
 * type=my&userId=1 이 유저아이디의 내가 쓴 게시물 출력
 * type=like 로그인한 유저가 좋아요를 누른 게시물 출력
 * type=search&keyword="조권영"&sort=title 제목으로 '조권영'을 검색
 *
 */

const pageHandller = async (type, userId, keyword, sort, page = 1, count = 8, order = 'recent') => {
    // const data = await postRepository.findSearchWriterKeyword('네임 1');
    // console.log(data);
    // const testD = data.map((e) => e.get({ plain: true }));
    // console.log(testD);
    let data, postData;
    switch (type) {
        case 'my': {
            //유저의 정보, 이 유저가 작성한 게시물 Posts 배열, UserDetail.gender
            data = await postRepository.findMyPage(userId, page, count);
            data = data.map((e) => e.get({ plain: true }));
            postData = data;
            break;
        }
        case 'like': {
            //배열[좋아요 테이블의 정보, 게시물의 정보 Posts]
            data = await postRepository.findLikePage(userId, page, count);
            data = data.map((e) => e.get({ plain: true }));
            postData = data.map((e) => e.Post);
        }
        case 'search': {
            switch (sort) {
                case 'title': {
                    data = await postRepository.findSearchTitleKeyword(keyword, page, count);
                    data = data.map((e) => e.get({ plain: true }));
                    postData = data;
                    break;
                }
                case 'writer': {
                    data = await postRepository.findSearchWriterKeyword(keyword, page, count);
                    data = data.map((e) => e.get({ plain: true }));
                    postData = data;
                }
                case 'content': {
                }
            }
        }
    }

    switch (order) {
        case 'recent': {
            postData.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });
            break;
        }
        case 'popular': {
            const orderByAttr = 'likeNum';
            break;
        }
        case 'male': {
            const orderByAttr = 'likeNum';
            break;
        }
        case 'female': {
            const orderByAttr = 'likeNum';
            break;
        }
        default: {
        }
    }
    console.log(postData);
    return;
};

const findLikeNumAndSort = (postData) => {};

module.exports = {
    pageHandller
};
