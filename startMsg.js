const { Post } = require('./src/sequelize/models');

// const fs = require('fs');

// const startMsg = fs.readFileSync('startMsg.txt', 'utf8').split(`\n`);

// for (let i = 0; i < 10; i++) {
//     const random = Math.random() * 100;
//     console.log(`${i}번째 내용`, startMsg[Math.floor(random)]);
// }

let today = new Date();
let yesterDay = new Date();

today.setDate(today.getDate() - 1);

console.log(today);
console.log(yesterDay);

const to =
    yesterDay.getFullYear() +
    '-' +
    String(yesterDay.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(yesterDay.getDate()).padStart(2, '0');

console.log(today < yesterDay);

Post.findAll({
    attributes: ['createdAt'],
    raw: true
}).then((data) => {
    console.log(data);
    console.log(new Date(data[0].createdAt.split(' ')[0]));
});

Post.findAll({
    where: {}
});
