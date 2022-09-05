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

exports.isLoggedIn = (req, res, next) => {
    // isAuthenticated()로 검사해 로그인이 되어있으면

    if (req.isAuthenticated()) {
        next(); // 다음 미들웨어
    } else {
        res.status(401).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        next(); // 로그인 안되어있으면 다음 미들웨어
    } else {
        res.status(403).send('로그인한 상태입니다.');
    }
};
