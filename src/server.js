const app = require('./app');

app.listen(process.env.PORT, () => {
    console.log('서버 가동', process.env.PORT);
});
