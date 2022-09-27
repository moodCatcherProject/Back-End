const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { error, error404 } = require('./layers/routes/middlewares/error');
const helmet = require('helmet');
const passport = require('passport');
const passportConfig = require('./layers/passport');
const { sequelize } = require('./sequelize/models');
const routerLoader = require('./layers/_router.loader');
const schedule = require('./layers/exceptModels/form/scheduller');

const cookieParser = require('cookie-parser');

schedule.schedule;
const whitelist = [];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(origin);
            callback(new Error('NOT_ALLOWED_ORIGIN'));
        }
    }
};
class App {
    constructor() {
        this.app = express();
        this.setMiddleWare();
        this.setRouter();
        this.setErrorHandler();
    }

    setMiddleWare() {
        passportConfig();

        if (process.env.MODE !== 'env' && process.env.NODE_ENV !== 'production') {
            sequelize
                .sync({ force: false })
                .then(() => {
                    console.log('데이터베이스 연결 성공');
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        this.app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음

        if (process.env.NODE_ENV === 'production') {
            //로그 생성
            this.app.use(morgan('combined')); // 배포환경이면
        } else {
            this.app.use(morgan('dev')); // 개발환경이면
        }

        this.app.use(helmet());

        this.app.use(cookieParser());

        this.app.use(cors({ origin: true, credentials: true })); // 화이트 리스트 생성 예정
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            next();
        }); // 모든 도메인

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
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
