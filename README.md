![6551879df85a26b0](https://user-images.githubusercontent.com/109029407/192130770-c8eda380-621c-4d14-b3d0-bf489260ef65.png)

---------------------------

# ✨무드캐처 (mood catcher)

- **무드 캐처를 꿈꾸는 모든 일반인들을 위한 커뮤니티 사이트.**
- 패션 커뮤니티, 옷의 후기 및 리뷰 취합.

# 📆 프로젝트 기간

- 2022/08/26 ~ 2022/10/07

# 👒 팀 소개
![come with me (5)](https://user-images.githubusercontent.com/71562311/193312964-ddc4017e-de9d-4f19-8305-cf6d227501f0.png)
| 역할 | 이름 | git |
| ------ | -- | ----|
| Back-end | 조권영 | https://github.com/kwanyung|
| Back-end | 황수민 | https://github.com/sumin-dev|
| Back-end | 이수범 | https://github.com/subeom-lee|
| Front-end | 박준수 | https://github.com/junsu1220|
| Front-end | 신수정 | https://github.com/crystal025| 
| UI & UX | 김유나 |  [무드캐처 FIGMA 디자인](https://www.figma.com/file/jtjWzOYOVgJ5I4dtneHYwG/%EB%AC%B4%EB%93%9C%EC%BA%90%EC%B3%90?node-id=117%3A290)|
| PM | 김승빈 | [무드캐처 FIGMA 기획](https://www.figma.com/file/jtjWzOYOVgJ5I4dtneHYwG/%EB%AC%B4%EB%93%9C%EC%BA%90%EC%B3%90?node-id=0%3A1)|   


# 👔 Project Architecture

![기술라이브러리](https://user-images.githubusercontent.com/71562311/191900453-d9de5da2-ed37-4a2b-baa1-2e558a176da8.PNG)

# 🩳 API 명세서
[▶ 무드캐처 REST API 바로가기](https://github.com/moodCatcherProject/Back-End/wiki/%EB%AC%B4%EB%93%9C%EC%BA%90%EC%B2%98-REST-API)

# 🧦 DB 설계도(ERD)
![진짜정말로세상에서마지막으로최종](https://user-images.githubusercontent.com/109029407/191969352-be2d455a-bedc-4af2-94ff-c8471c204b5f.png)


# 👟 사용한 라이브러리(패키지)



### ✅ 자동 배포 git actions을 사용한 이유

- **Jenkins**는 프로젝트 표준 컴파일 환경에서의 컴파일 오류 검출, 자동화 테스트 수행 등 많은 장점들이 있지만, 서버 설치도 필요하고, 호스팅을 직접 해야하기 때문에 서버 운영 및 관리 비용이 발생하며 규모가 작은 프로젝트의 경우, 설정하는데 리소스 낭비가 발생할 수 있다는 단점들이 있기 때문에 프로젝트와 맞지 않다고 느껴서 사용하지 않았음
- **Git hub actions**는 기본적으로 무료이며 다른 툴을 설치하지 않아도 Github Repo에서 바로 사용 할 수 있고,  비동기 CI/CD가 가능하고, 많은 언어와 프레임워크를 지원하고 있고, YAML로 작성 할 수 있어서 일반적인 코드를 작성하듯 편집, 재사용, 공유, 포킹을 할 수 있다는 장점이 있음

⇒ 현재 프로젝트에 적용하기에 가장 적합하다고 판단하여 Git actions 선택

### ✅ 백엔드에서 이미지 처리를 한 이유

- 이미지 용량 제한을 할 수 있고, DB와 S3를 연동하여 확실한 데이터 처리가 가능함. 예를 들어, 유저가 게시물을 삭제하거나 회원 탈퇴할 경우, 어떤 유저의 파일인지 추적, 처리하여 메모리 낭비를 줄이고, 데이터의 무결성을 증대할 수 있음.



### ✅ 관계형 데이터베이스(RDBMS)를 사용한 이유

- 프로젝트 구조 상 유저를 중심으로 관계를 맺는 데이터가 많기 때문에 DB indexing으로 데이터 관리를 용이하게 함.



### ✅ 왜 session이 아닌 jwt방식을 선택했을까?

- **세션 방식**은 서버의 메모리 내부에 유저의 정보를 저장함. 유저의 수가 증가할수록 세션의 양이 많아지는 만큼 메모리에 부하가 걸릴 수 있음. 실제 서비스 배포를 위한 프로젝트에서는 유저의 수가 적지 않을 거라 예상하여 **JWT 토큰 인증방식** 선택. JWT는 서버의 메모리에 저장 공간을 확보하지 않고 토큰 발급 및 확인 절차만 거치므로 서버 자원과 비용을 절감할 수 있음.
- 하지만 현재 무드캐처의 **jwt 방식은 토큰의 유효기간이 만료되지 않으면 소멸하지 않기 때문에 토큰 탈취, 해킹 등 보안에 취약점을 가지고 있음. access token/refresh token으로 변경하여 보안 강화 필요.**

# 💍 기술 소개

```json

"dependencies"
	
    "aws-sdk": "^2.1206.0",     //aws 서비스를 사용하기 위한 라이브러리
    "bcrypt": "^5.0.1",         // 비밀번호 해쉬화를 위한 라이브러리
    "cheerio": "^1.0.0-rc.12",  //html 스크래핑을 위한 라이브러리(크롤링)
    "cookie-parser": "^1.4.6",  // 요청 된 쿠키를 추출 할 수있게 해주는 미들웨어
    "cors": "^2.8.5",           // CORS 이슈 해결을 위한 라이브러리
    "crypto-js": "^4.1.1",      // 인증번호 해쉬화를 위한 라이브러리
    "dotenv": "^16.0.1",        //.env의 정보를 환경변수로 등록해주는 라이브러리
    "express": "^4.18.1",       // 웹 서버를 구현하기 위한 라이브러리
    "helmet": "^6.0.0",         //header에 설정을 통해 웹 취약점으로부터 서버 보호
    "jsonwebtoken": "^8.5.1",   // jwt로그인 방식을 위한 라이브러리
    "morgan": "^1.10.0",        // 통신 로그를 남기기 위한 라이브러리
    "multer": "^1.4.5-lts.1",   //image를 form데이터로 받기 위한 라이브러리
    "multer-s3": "^2.10.0",     // aws s3를 multer와 연결해주는 라이브러리
    "mysql2": "^2.3.3",         // mysql을 사용할 수 있게 해주는 라이브러리
    "node-schedule": "^2.1.0",  // 시간을 설정하며 특정 함수를 자동으로 작동하게 만드는 라이브러리
    "nodemailer": "^6.7.8",     //메일 전송을 위한 라이브러리
    "nodemon": "^2.0.19",       // 서버 재 가동을 쉽게 해주는 라이브러리
    "passport": "^0.5.3",       // 인증 절차에 대한 로직을 편리하게 구성할 수 있는 모듈
    "passport-kakao": "^1.0.1", // 카카오 인증절차의 편리성 증대
    "passport-local": "^1.0.0", // 로컬 인증절차의 편리성 증대
    "sequelize": "^6.21.4",     // ORM 라이브러리
    

"devDependencies": {
    "jest": "^29.0.1",           // 테스트 코드 라이브러리
    "lint-staged": "^13.0.3",    // 코드 컨벤션을 위한 라이브러리
    "prettier": "^2.7.1",        // 코드 컨벤션을 위한 라이브러리
    "sequelize-cli": "^6.4.1",   // Sequelize 지원 라이브러리
    "supertest": "^6.2.4"        // 테스트 코드 라이브러리
  }
  
```


