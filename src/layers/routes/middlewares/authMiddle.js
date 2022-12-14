const exception = require('../../exceptModels/_.models.loader');
const jwt = require('jsonwebtoken');
const { User, UserDetail, Auth } = require('../../../sequelize/models');
/**
 * 로그인에 해당하는 전략을 짜야하는데,
로그인한 사용자는 회원가입과 로그인 라우터에 접근하면 안되며,
로그인을 하지 않은 사용자는 로그아웃 라우터에 접근하면 안된다.
 
따라서 라우터에 접근 권한을 제어하는 미들웨어가 필요하다. 
Passport는 req객체에 isAuthenticated라는 메서드를 자동으로 만들어준다.
로그인이 되어있다면 req.isAuthenticated()가 true일 것이고, 
그렇지 않다면 false일 것이다.
따라서 이 메서드를 통해 로그인 여부를 파악할 수 있다.
auth.js 라우터에 로그인 여부를 검사하는 위 미들웨어들을 넣어 
원하지 않는 상황들을 방지할 수 있다.
 */

exports.isLoggedIn = async (req, res, next) => {
    // isAuthenticated()로 검사해 로그인이 되어있으면
    try {
        const { authorization } = req.headers;

        if (authorization == null) {
            throw new exception.UnauthorizedException('로그인 필요');
        }
        const [tokenType, tokenValue] = authorization.split(' ');

        if (tokenType !== 'Bearer') {
            throw new exception.UnauthorizedException('로그인 필요');
        }
        const myToken = verifyToken(tokenValue);

        if (myToken === 'jwt expired') {
            console.log('access token 만료');
            const userInfo = jwt.decode(tokenValue, process.env.SECRET_KEY);
            const userId = userInfo.userId;

            let refreshToken;
            Auth.findOne({ where: { authId: userId } }).then((data) => {
                refreshToken = data.refreshToken;
                const myRefreshToken = verifyToken(refreshToken);
                if (myRefreshToken === 'jwt expired') {
                    throw new exception.UnauthorizedException('로그인 필요');
                } else {
                    const myNewToken = jwt.sign({ userId: data.authId }, process.env.SECRET_KEY, {
                        expiresIn: '2h'
                    });
                    res.send({ message: 'new token', myNewToken });
                }
            });
        } else {
            const { userId } = jwt.verify(tokenValue, process.env.SECRET_KEY);

            // 로그아웃 관련 refresh token 없을 때 에러 발생
            // const auth = await Auth.findOne({
            //     where: { authId: userId },
            //     attributes: ['refreshToken'],
            //     raw: true
            // });
            // if (!auth.refreshToken) {
            //     throw new exception.ConflictException('refreshToken 없음');
            // }

            const userData = await User.findOne({ where: userId });
            const detailUserData = await UserDetail.findOne({ where: { detailId: userId } });
            res.locals.user = userData.dataValues;
            res.locals.detailUser = detailUserData.dataValues;

            // UserDetail.findOne({ where: { detailId: userId } }).then((detail) => {
            //     res.locals.detailUser = detail;
            // });
            next();
        }
    } catch (err) {
        next(err);
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [tokenType, tokenValue] = (authorization || '').split(' ');

        if (tokenValue.length > 15 && tokenType == 'Bearer') {
            res.status(404).send({
                errorMessage: '로그인 상태'
            });
            return;
        }
        next();
    } catch (err) {
        next();
    }
};

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        return err.message;
    }
}
