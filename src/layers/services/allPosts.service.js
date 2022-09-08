const postRepository = require('../repositories/post.repository');
const exception = require('../exceptModels/_.models.loader');

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

const pageHandller = async (
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

            break;
        }
        case 'like': {
            //배열[좋아요 테이블의 정보, 게시물의 정보 Posts]

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
            // data = await postRepository
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

module.exports = {
    pageHandller
};
