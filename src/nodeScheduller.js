//특정 요일 특정 시간 마다 특정 함수를 실행시켜주는 파일
console.log('실행');
const schedule = require('node-schedule');

schedule.scheduleJob('* * 5 * * *', () => {
    console.log('초마다 실행');
});

module.exports = {
    schedule
};
// *     *    *     *    *     *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

{
}
