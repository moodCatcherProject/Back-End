const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./config/s3');
const { Post, User } = require('../../../sequelize/models');
const exception = require('../../exceptModels/_.models.loader');

class S3ImageController {
    upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: 'gwonyeong', //버켓 이름
            acl: 'public-read', //접근 권한
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: function (req, file, cb) {
                const { postId } = req.params;

                let ext = file.mimetype.split('/')[1]; // 확장자
                // 이미지만 처리
                if (!['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
                    Post.destroy({
                        where: { postId, imgUrl: 'default' }
                    })
                        .then(() => {
                            return cb(new exception.NotFoundException('이미지 파일이 아닙니다!'));
                        })
                        .catch((err) => {
                            return cb(
                                new exception.NotFoundException(
                                    '이미지 파일이 아닙니다! + 게시물 없음'
                                )
                            );
                        });
                    return cb(new exception.NotFoundException('이미지 파일이 아닙니다!'));
                }
                new Error();
                console.log(file);
                cb(null, `post/${Date.now()}.${file.mimetype}`);
            }
        }),
        limits: { fileSize: 5 * 1024 * 1024 } // 5메가로 용량 제한
    });
    //해당 게시물의 이미지 삭제
    delete_file = async (req, res, next) => {
        const { postId } = req.params;
        const imageName = await Post.findOne({
            where: { postId }
        });

        let params = {
            Bucket: 'gwonyeong',
            Key: `${imageName.imgUrl}`
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

    //해당 유저의 이미지 삭제
    delete_profile = async (req, res, next) => {
        const { userId } = res.locals.user;
        const imageName = await User.findOne({
            where: { userId }
        });

        let params = {
            Bucket: 'gwonyeong',
            Key: `${imageName.imgUrl}`
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
