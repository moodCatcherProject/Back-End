const e = require('express');
const itemService = require('../services/item.Service.js');
const exception = require('../exceptModels/_.models.loader');

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const crawlingMusinsa = async (req, res, next) => {
    try {
        const { keyword } = req.params;

        const items = await itemService.crawlingMusinsa(keyword);

        return res.status(200).json(new exception.FormDto('무신사 아이템 조회 성공!', items));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    crawlingMusinsa
};
