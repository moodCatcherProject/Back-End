const express = require('express');
const passport = require('passport');
const morgan = require('morgan');
const passportConfig = require('./layers/passport');
const { sequelize } = require('./sequelize/models');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const routerLoader = require('./layers/_router.loader');
const path = require('path');
const bodyParser = require('body-parser');
const schedule = require('./layers/exceptModels/form/scheduller');
const cors = require('cors');
const { error, error404 } = require('./layers/routes/middlewares/error');
schedule.schedule;
// const whitelist = ['http://localhost:3000/'];
// const corsOptions = {
//     origin: '*',
//     credential: true
// };
class App {
    constructor() {
        this.app = express();
        this.setMiddleWare();
        this.setRouter();
        this.setErrorHandler();
    }
    setMiddleWare() {
        passportConfig();
        // this.app.use(cookieParser(process.env.COOKIE_SECRET));
        // //세션 겍체 생성
        // this.app.use(
        //     session({
        //         resave: false,
        //         saveUninitialized: false,
        //         secret: process.env.COOKIE_SECRET,
        //         cookie: {
        //             httpOnly: false,
        //             secure: false
        //         }
        //     })
        // );
        if (process.env.MODE !== 'dev') {
            sequelize
                .sync({ force: true })
                .then(() => {
                    console.log('데이터베이스 연결 성공');
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        this.app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
        // this.app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
        this.app.use(morgan('dev')); //로그 생성

        this.app.use(cors()); // 화이트 리스트 생성 예정
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        }); // 모든 도메인

        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ limit: '10mb', extended: false }));
        this.app.use('/', express.static(path.join(__dirname, '../public')));
    }
    setRouter() {
        this.app.use('/api', routerLoader);
    }
    setErrorHandler() {
        this.app.use(error404);
        this.app.use(error);
    }
}
module.exports = new App().app;
