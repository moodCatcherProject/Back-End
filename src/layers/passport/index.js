const passport = require('passport');
const local = require('./localStrategy'); // 로컬서버로 로그인할때
const kakao = require('./kakaoStrategy'); // 카카오서버로 로그인할때
const {User} = require("../../models")
 
module.exports = () => {
   /*
    * ㅇ 직렬화(Serialization) : 객체를 직렬화하여 전송 가능한 형태로 만드는 것.
    * ㅇ 역직렬화(Deserialization) : 직렬화된 파일 등을 역으로 직렬화하여 다시 객체의 형태로 만드는 것.
    */
 
   //? req.login(user, ...) 가 실행되면, serializeUser가 실행된다.
   //? 즉 로그인 과정을 할때만 실행
   /**
    * strategy에서 로그인 성공시 호출하는 done(null, user) 함수의 두 번째 인자 user를 전달 받아 세션(req.session.passport.user)에 저장
    보통 세션의 무게를 줄이기 위해, user의 id만 세션에 저장
    */
   passport.serializeUser((user, done) => {
      // req.login(user, ...)의 user가 일로 와서 값을 이용할수 있는 것이다.
     
      done(null, user.userId);
      // req.session객체에 어떤 데이터를 저장할 지 선택.
      // user.id만을 세션객체에 넣음. 사용자의 온갖 정보를 모두 들고있으면, 
      // 서버 자원낭비기 때문에 사용자 아이디만 저장 그리고 데이터를 deserializeUser애 전달함
      // 세션에는 { id: 3, 'connect.sid' : s%23842309482 } 가 저장됨
   });
 
   //? deserializeUser는 serializeUser()가 done하거나 passport.session()이 실행되면 실행된다.
   //? 즉, 서버 요청이 올때마다 항상 실행하여 로그인 유저 정보를 불러와 이용한다.
   /**
    * 서버로 들어오는 요청마다 세션정보를 실제 DB와 비교
    해당 유저 정보가 있으면 done을 통해 req.user에 사용자 전체 정보를 저장 (그러면 다른 미들웨어에서 req.user를 공통적으로 사용 가능)
    serializeUser에서 done으로 넘겨주는 user가 deserializeUser의 첫 번째 매개변수로 전달되기 때문에 둘의 타입은 항상 일치 필요
    */
   passport.deserializeUser((userId, done) => {
      // req.session에 저장된 사용자 아이디를 바탕으로 DB 조회로 사용자 정보를 얻어낸 후 req.user에 저장. 
      // 즉, id를 sql로 조회해서 전체 정보를 가져오는 복구 로직이다.
      User.findOne({ where: { userId } })
         .then(
            user =>{console.log(user.userId)
                done(null, user)}) //? done()이 되면 이제 다시 req.login(user, ...) 쪽으로 되돌아가 다음 미들웨어를 실행하게 된다.
         .catch(err => done(err));
   });
 
   //^ 위의 이러한 일련의 과정은, 그냥 처음부터 user객체를 통째로 주면 될껄 뭘 직렬화/역직렬화를 하는 이유는
   //^ 세션 메모리가 한정되어있기때문에 효율적으로 하기위해, user.id값 하나만으로 받아와서, 
   //^ 이를 deserialize 복구해서 사용하는 식으로 하기 위해서다.
 
   /* ---------------------------------------------------------------------- */
 
   local();
   kakao();
};