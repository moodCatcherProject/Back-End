const exception = require("../src/layers/exceptModels/_.models.loader")

const gwon = 453


try{
const title = new exception.isString({title:req.body.title}).value
}catch(err){
    console.log(err)
}
