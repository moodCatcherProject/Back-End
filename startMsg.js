const fs = require('fs');

const startMsg = fs.readFileSync('startMsg.txt', 'utf8').split(`\n`);

for (let i = 0; i < 10; i++) {
    const random = Math.random() * 100;
    console.log(`${i}번째 내용`, startMsg[Math.floor(random)]);
}
