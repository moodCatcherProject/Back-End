const searchService = require('../services/searchService.js');
const { FormDto } = require('../exceptModels/_.models.loader');

const crawlingMusinsa = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const data = await searchService.crawlingMusinsa(keyword);

        return res.status(200).json(new FormDto('크롤링 성공!', data));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    crawlingMusinsa
};
