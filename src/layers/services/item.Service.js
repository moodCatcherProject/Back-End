const axios = require('axios');
//브라우저와 Node 환경에서 사용하는 Promise 기반의 HTTP Client로 사이트의 HTML을 가져올 때 사용할 라이브러리
const cheerio = require('cheerio');
//Node.js 환경에서 JQuery처럼 DOM Selector 기능들을 제공. Axios의 결과로 받은 데이터에서 필요한 데이터를 추출하는데 사용하는 라이브러리

const crawlingMusinsa = async (keyword) => {
    const getHTML = async (keyword) => {
        try {
            //무신사 상품 검색 결과 페이지(무신사 추천순 90개)
            return await axios.get(
                `https://www.musinsa.com/search/musinsa/goods?q=${encodeURI(
                    keyword
                )}&list_kind=small&sortCode=pop&sub_sort=&page=1&display_cnt=0&saleGoods=&includeSoldOut=&setupGoods=&popular=&category1DepthCode=&category2DepthCodes=&category3DepthCodes=&selectedFilters=&category1DepthName=&category2DepthName=&brandIds=&price=&colorCodes=&contentType=&styleTypes=&includeKeywords=&excludeKeywords=&originalYn=N&tags=&campaignId=&serviceType=&eventType=&type=&season=&measure=&openFilterLayout=N&selectedOrderMeasure=&shoeSizeOption=&groupSale=&d_cat_cd=&attribute=`
            );
        } catch (err) {
            console.log(err);
        }
    };
    const parsing = async (keyword) => {
        const html = await getHTML(keyword);

        const $ = cheerio.load(html.data);
        const $itemList = $('.li_box');

        let items = [];
        $itemList.each((idx, node) => {
            if (idx < 30) {
                const brand = $(node).find('.item_title').text();
                const imgUrl = $(node).find('.list_img> a> img').attr('data-original');
                const price = $(node).find('.price').text();
                const name = $(node).find('.list_info>a').attr('title');
                const url = $(node).find('.list_img> a').attr('href');

                items.push({
                    imgUrl: 'https:' + imgUrl,
                    brand,
                    name,
                    price: price.trim(),
                    url
                });
            }
        });
        return { items };
    };
    return await parsing(keyword);
};

module.exports = {
    crawlingMusinsa
};
