const {User} = require('../../sequelize/models');
const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;
require("dotenv").config({ path: ".env" });
module.exports = () => {
   passport.use(
      new KakaoStrategy(
         {
            clientID: process.env.KAKAO_ID, // 카카오 로그인에서 발급받은 REST API 키
            callbackURL: '/api/auth/kakao/callback', // 카카오 로그인 Redirect URI 경로
         },
         /*
          * clientID에 카카오 앱 아이디 추가
          * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
          * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
          * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
          */
         //이 엑세스와 리프레시 토큰은 카카오 서비스를 이용하기 위한 토큰이기
         //때문에 탈취를 막을 수 없다면 안쓰는게 나음.
         async (accessToken, refreshToken, profile, done) => {
            
            try {
               const exUser = await User.findOne({
                  // 카카오 플랫폼에서 로그인 했고 & snsId필드에 카카오 아이디가 일치할경우
                  where: { snsId: profile.id, provider: 'kakao' },
               });
               // 이미 가입된 카카오 프로필이면 성공
               if (exUser) {
                  done(null, exUser); // 로그인 인증 완료
               } else {
                  // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
                 
                  const newUser = await User.create({
                     
                     nickname: profile.displayName,
                     snsId: profile.id,
                     provider: 'kakao',
                  });
                  done(null, newUser); // 회원가입하고 로그인 인증 완료
               }
            } catch (error) {
               console.error(error);
               done(error);
            }
         },
      ),
   );
}
//인가코드를 받아서 거기로 이동시킨다. 프론트랑 연결 할 때.
// 프론트 메인 url로 보낼 수 있어야 한다.