class CheckType {
    value;
    /**
     *
     * @param {*} obj
     * @param {*} type
     * @param {boolean} required
     *
     */
    constructor(obj, type, required) {
        const keys = Object.keys(obj)[0];
        const value = obj[keys];

        const checkType = this.checkValue(value, type);
        if (required && !obj) {
            throw new Error(`${keys}가 undefined 또는 null 값 입니다!`);
        }
        if (!checkType) {
            throw new Error(
                `${keys} 은(는) ${typeof value}이(가) 아닌 ${type}이어야 합니다!`
            );
        }
        this.value = value;
    }

    checkValue(value, type) {
        return typeof value === type;
    }
}

class isString extends CheckType {
    constructor(value, required = false) {
        const inst = super(value, "string", required);
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
    constructor(value, required = false) {
        super(value, "number", required);
        return;
    }
}
class isObject extends CheckType {
    constructor(value, required = false) {
        super(value, "object", required);
        return;
    }
}

module.exports = {
    isString,
    isNumber,
    isObject,
};
