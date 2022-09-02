const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./config/s3');
const { Post } = require('../../../sequelize/models');
const exception = require('../../exceptModels/_.models.loader');

class S3ImageController {
    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'gwonyeong', //버켓 이름
            acl: 'public-read', //접근 권한
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                const filename = file.originalname.split('.')[0];
                switch (file.mimetype) {
                    case 'image/jpeg':
                        file.mimetype = 'jpg';
                        break;
                    case 'image/png':
                        file.mimetype = 'png';
                        break;
                    case 'image/jpg':
                        file.mimetype = 'jpg';
                        break;
                    default:
                        return cb(exception.NotFoundException('이미지 파일이 아닙니다!'));
                }

                cb(null, `post/${Date.now()}${filename}.${file.mimetype}`);
            }
        }),
        limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
    });
    delete_file = async (req, res, next) => {
        const { postId } = req.params;
        const imageName = await Post.findOne({
            where: { postId }
        });
        console.log(imageName.imageUrl);
        let params = {
            Bucket: 'gwonyeong',
            Key: `${imageName.imageUrl}`
        };

        try {
            s3.deleteObject(params, function (error, data) {
                if (error) {
                    console.log('err: ', error, error.stack);
                } else {
                    console.log(data, ' 정상 삭제 되었습니다.');
                }
            });
            next();
        } catch (err) {
            console.log(err);
            throw err;
        }
    };
}

module.exports = S3ImageController;
// => 이렇게 설정한 upload라는 객체를 뒤에 라우터에 장착하면 된다
