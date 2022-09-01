const AWS = require("aws-sdk");
require("dotenv").config();
const env = process.env;

const s3 = new AWS.S3({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  region: "ap-northeast-2",
});

module.exports = s3;
