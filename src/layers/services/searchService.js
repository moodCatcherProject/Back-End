const axios = require('axios');
//html을 쉽게 파싱 할 수 있게 만들어준다.
const cheerio = require('cheerio');
const exception = require('../exceptModels/_.models.loader');

const crawlingMusinsa = async (keyword) => {
    const getHTML = async (keyword) => {
        try {
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

        //실제 코드는 html.data안에 있음.
        const $ = cheerio.load(html.data);
        const $courseList = $('.li_box');

        let items = [];
        //첫 인자는 인덱스 , 두번째 인자는 자료 하나하나
        $courseList.each((idx, node) => {
            const brand = $(node).find('.item_title').text();
            const image = $(node).find('.list_img> a> img').attr('data-original');
            const price = $(node).find('.price').text();
            const title = $(node).find('.list_info>a').attr('title');
            // console.log(title)
            items.push({
                brand,
                title,
                image: 'https:' + image,
                price: price.trim()
            });
        });
        // throw new Exception.NotFoundException("찾을 수 없음!")
        return { items };
    };
    return await parsing(keyword);
};

module.exports = {
    crawlingMusinsa
};
