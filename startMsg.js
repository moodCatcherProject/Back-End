const { Post, StartMessage } = require('./src/sequelize/models');
const sequelize = require('sequelize');
const scheduller = require('./src/layers/exceptModels/form/scheduller');
// scheduller.totalLikeCount;
// scheduller.likeCountInit;
// scheduller.updateGrade;
// scheduller.deleteNotice;
// scheduller.createHotPost;
const Op = sequelize.Op;
const fs = require('fs');

const startMsg = fs.readFileSync('startMsg.txt', 'utf8').split(`\n`);
console.log(startMsg.length);
for (let i = 0; i < startMsg.length; i++) {
    StartMessage.create({ message: startMsg[i] });
}

// for (let i = 0; i < 10; i++) {
//     const random = Math.random() * 100;
//     console.log(`${i}번째 내용`, startMsg[Math.floor(random)]);
// }

// let today = new Date();
// let yesterDay = new Date(new Date() - 24 * 60 * 60 * 1000);

// // today.setDate(today.getDate() - 1);

// console.log(today);
// console.log(yesterDay);

// const to =
//     yesterDay.getFullYear() +
//     '-' +
//     String(yesterDay.getMonth() + 1).padStart(2, '0') +
//     '-' +
//     String(yesterDay.getDate()).padStart(2, '0');

// console.log(today < yesterDay);

// Post.count({
//     where: {
//         createdAt: {
//             [Op.lt]: today,
//             [Op.gt]: yesterDay
//         }
//     },

//     raw: true
// }).then((data) => {
//     console.log(data);
//     // console.log(new Date(data[0].createdAt.split(' ')[0]));
// });

// Post.findAll({
//     where: {}
// });

// let status = true;
// status = !status;
// status = !status;
// console.log(status);

// const data = [
//     { name: '권영', createdAt: 0911 },
//     { name: '수민', createdAt: 0910 },
//     { name: '수범', createdAt: 0909 }
// ];
// const calcurateCreatedAt = (createdAt) => {
//     return createdAt + 10;
// };

// for (let gwonyeong of data) {
//     gwonyeong.createdAt = calcurateCreatedAt(At.createdAt);
// }
// console.log(data);
