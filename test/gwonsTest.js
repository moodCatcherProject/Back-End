const { Post } = require('../src/sequelize/models');

const { sequelize } = require('./sequelize/models');

sequelize
    .sync({ force: true })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    });
