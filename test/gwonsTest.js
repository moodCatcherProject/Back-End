const exception = require("../src/layers/exceptModels/_.models.loader")

const gwon = "                          "
const sumin = "           수     민      쓰      "
const subeom = " 수          범 쓰                         "
const num = 15364
const obj = {
    name: "권영",
    gender : "남자"
}

console.log(new exception.isString({gwon}).trim)
console.log(new exception.isString({sumin}))
console.log(new exception.isString({subeom}))
console.log(new exception.isNumber({num}))
console.log(new exception.isObject({obj}))
console.log(new exception.isObject({gwon}))

