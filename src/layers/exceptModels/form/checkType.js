/**
 * @version 1.2
 * @desc 데이터가 객체로 오지 않을 때의 경우 추가
 *  */
class CheckType {
    exception = require('../_.models.loader');
    value;
    /**
     *
     * @param {*} obj
     * @param {*} type
     * @param {boolean} required
     *
     */
    constructor(obj, type) {
        if (typeof obj !== 'object') {
            throw new Error('데이터가 객체로 와야합니다!');
        }
        const keys = Object.keys(obj)[0];
        const value = obj[keys];

        const checkType = this.checkValue(value, type);
        if (!value) {
            throw new this.exception.BadRequestException(`${keys}이(가) 없음!`);
        }
        if (!checkType) {
            throw new this.exception.BadRequestException(
                `${keys} 은(는) ${typeof value}이(가) 아닌 ${type}이어야 합니다! 현재 ${keys}의 값은 ${value}입니다.`
            );
        }
        this.value = value;
        this.exception = '';
    }

    checkValue(value, type) {
        return typeof value === type;
    }
}

class isString extends CheckType {
    constructor(value) {
        const inst = super(value, 'string');

        try {
            if (Object.values(value)[0].trim().length === 0) {
                throw new Error(`${Object.keys(value)[0]}이(가) 빈 값입니다!`);
            }
        } catch (err) {
            throw err;
        }
        this.trim = inst.value.trim();
        return;
    }
}

class isNumber extends CheckType {
    constructor(value) {
        super(value, 'number');
    }
}
class isObject extends CheckType {
    constructor(value) {
        super(value, 'object');
    }
}

module.exports = {
    isString,
    isNumber,
    isObject
};
