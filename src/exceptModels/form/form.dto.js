class FormDto {
    
    msg;
    data;

    /**
     *
     * 
     * @param { string } msg
     * @param { object } data
     */
    constructor( msg, data = {}) {
        

        const isString = this.#isString(msg);
        if (!isString) throw new Error('FormDto.msg 는 string 타입 이어야 합니다.');

        const isObject = this.#isObject(data);
        if (!isObject)
            throw new Error('FormDto.data 는 Array 가 아닌 Object 타입 이어야 합니다.');

       
        this.msg = msg;
        this.data = data;
    }

    #isString(value) {
        return typeof value === 'string';
    }
    #isObject(value) {
        return !(value instanceof Array) && value instanceof Object;
    }
}





module.exports = {
    FormDto,

  
};
