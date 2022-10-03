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

![아키텍처](https://user-images.githubusercontent.com/71562311/193547713-1350e22a-4dd4-4d5b-becd-8a0afac8eee5.PNG)


# 🩳 API 명세서
[▶ 무드캐처 REST API 바로가기](https://github.com/moodCatcherProject/Back-End/wiki/%EB%AC%B4%EB%93%9C%EC%BA%90%EC%B2%98-REST-API)

# 🧦 DB 설계도(ERD)
![erd최최치최최최최최최최치ㅗ치ㅚ최최최최종](https://user-images.githubusercontent.com/71562311/193547823-facca37d-e15c-4a8d-befe-69675f7f1e8f.PNG)



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

### 이미지 리사이징

<aside>
❓ 주어진 문제와 요구 사항

- 기존
    - 사용자 경험에 치명적일 정도로 이미지 렌더링이 지연 됨.
- 고민
    - 이미지를 불러오는 시간을 줄일 방법이 필요함.
    - 이미지의 박스 크기는 140px 185px의 크기인데 이미지의 원본의 크기는 과하게 크다는 결론.
- 결정
    - 사용자 경험에 치명적이지 않은 선에서 이미지 리사이징을 결정.
</aside>

---

<aside>
💡 가설과 선택지

- 백엔드 서버에서 리사이징, aws lambda를 활용한 리사이징
    - 백엔드 서버에서 리사이징을 진행하게 되면 서버의 자원을 소모하게 되고 시간도 오래걸려 서버에 무리가 가게 됨.
    - aws lambda는 달에 100만 건 까지 무료이고 serverless의 특성을 이용할 수 있어 효율적.
        - serverless : 서버에서 일을 직접 처리하지 않고 클라우드 환경에서 대신 일을 처리하는 아키텍처
- 
</aside>

---

<aside>
🧑‍⚖️ 의사 결정과 근거, 구현

- aws lambda를 이용해 s3에 이미지가 업로드 되면 이미지 리사이징 함수를 실행.
</aside>

---

<aside>
💡 ✅결과

**모든 결과는 이미지 캐시를 삭제 한 후 테스트한 결과입니다.**

<aside>
💡 원본 이미지를 출력

![원본사진 불러오는 데 걸리는 시간.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/153102a1-3460-4877-b6bb-da2f76bb320b/%EC%9B%90%EB%B3%B8%EC%82%AC%EC%A7%84_%EB%B6%88%EB%9F%AC%EC%98%A4%EB%8A%94_%EB%8D%B0_%EA%B1%B8%EB%A6%AC%EB%8A%94_%EC%8B%9C%EA%B0%84.png)

![이미지 원본GIF.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/dee8da58-6cc5-4c54-b41c-961dc840ee07/%EC%9D%B4%EB%AF%B8%EC%A7%80_%EC%9B%90%EB%B3%B8GIF.gif)

</aside>

<aside>
💡 리사이징 된 이미지 출력

![이미지 리사이징 걸리는 시간.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/192999ee-74e2-4ce5-81de-e0d41ccc6456/%EC%9D%B4%EB%AF%B8%EC%A7%80_%EB%A6%AC%EC%82%AC%EC%9D%B4%EC%A7%95_%EA%B1%B8%EB%A6%AC%EB%8A%94_%EC%8B%9C%EA%B0%84.png)

![이미지 리사이징GIF.gif](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/52901e8a-95c6-4044-a3e2-de0b20e01723/%EC%9D%B4%EB%AF%B8%EC%A7%80_%EB%A6%AC%EC%82%AC%EC%9D%B4%EC%A7%95GIF.gif)

</aside>

</aside>

### 전체 게시물 출력

<aside>
❓ 주어진 문제와 요구 사항

- 기존
    - 기능 별이 아닌 페이지를 기준으로 api를 나누었음.
        - 메인 페이지의 전체 게시물 출력, 마이 페이지 게시물 출력 등등
- 고민
    - 페이지 별이 아닌 기능 별로 api를 구성하는 것이 좋다는 피드백
    - 형식이 아닌 데이터의 내용만 바뀌는데 굳이 이렇게 많은 api가 필요한가 라는 의문
- 결정
    - api 하나로 충분히 데이터 전송이 가능하다는 판단 하에 api를 하나로 축소
</aside>

### 이전 api명세

![api명세 이전.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c64d9eef-40b8-4324-a412-6af93fd6c23e/api%EB%AA%85%EC%84%B8_%EC%9D%B4%EC%A0%84.png)

![마이페이지 api.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ebc722d5-b5bc-4787-81e5-d4b242fd0f3d/%EB%A7%88%EC%9D%B4%ED%8E%98%EC%9D%B4%EC%A7%80_api.png)

![옷장 페이지.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/3fc90691-1fc1-4e37-ae1e-d34480525b3b/%EC%98%B7%EC%9E%A5_%ED%8E%98%EC%9D%B4%EC%A7%80.png)

---

<aside>
💡 가설과 선택지

- 현재 서비스 중인 인프런에서 url을 관찰하며 아이디어를 얻음.
    
    ![인프런.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5d35a980-1729-49c8-bbe0-399eeaa4a7ff/%EC%9D%B8%ED%94%84%EB%9F%B0.png)
    
    ![인프런 주소.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bb1378c3-82ba-4d07-bfa4-aeca95dba2c0/%EC%9D%B8%ED%94%84%EB%9F%B0_%EC%A3%BC%EC%86%8C.png)
    
- 서버에서 프론트에게 전달해주는 데이터는 결국 내용만 바뀌고 형식은 변하지 않기 때문에 query를 이용하면 모든 경우의 수를 고려 할 수 있다고 판단.
</aside>

---

<aside>
🧑‍⚖️ 의사 결정과 근거, 구현

- query 값을 이용해 경우의 수를 나누는 알고리즘 생성
    - 코드
        
        ```jsx
        /**
         * page , count 는 항상 필수 (default값을 정해도 좋을 것 같음.)
         * order 는 기본적으로는 recent 값으로 줘도 좋을 것 같음.
         * == 여기까지 기본으로 같이 오는 값
         * type=my&userId=1 이 유저아이디의 내가 쓴 게시물 출력
         * type=like 로그인한 유저가 좋아요를 누른 게시물 출력
         * type=search&keyword="조권영"&sort=title 제목으로 '조권영'을 검색
        1. 전체게시물 :
            1. 남자 2. 여자
                => 최신순 인기순
        2. 나의 옷장(게시물) 
            => 최신순 인기순 
        3. 검색 결과 페이지 
            1. 남자 2. 여자
                => 최신순 인기순 
        4. 검색 알고리즘
            만약 남녀 값이 오지 않으면 전체 출력
         * 
         */
        
        /**
         * @desc 매개변수의 조합에 따라 보여주는 게시물이 달라짐.
         * @param {number} userId 다른 사람의 마이페이지 출력 시
         * @param {*} keyword search 검색기능을 이용할 때 필요한 키워드
         * @param {*} sort title, writer
         * @param {*} type my : 마이페이지, like : 내가 좋아요 한 페이지, search : 검색 결과 페이지
         * @param {*} gender '남자', '여자' , ['남자, '여자']
         * @param {*} page '현재의 페이지'
         * @param {*} count ' 한 페이지 출력 개수'
         * @param {*} order recent : 최신 순, popular : 인기 순
         * @returns 게시물 데이터
         */
        const findAllPosts = async (
            userId,
            keyword, //검색결과
            sort, // 검색종류 title, writer
            type = 'all',
            gender = ['남자', '여자'],
            page = 1,
            count = 8,
            order = 'recent'
        ) => {
            
            let data, orderKey;
            switch (order) {
                case 'recent': {
                    orderKey = 'createdAt';
                    order = 'DESC';
        
                    break;
                }
                case 'popular': {
                    orderKey = 'likeCount';
                    order = 'DESC';
        
                    break;
                }
            }
        
            switch (type) {
                case 'my': {
                    //유저의 정보, 이 유저가 작성한 게시물 Posts 배열, UserDetail.gender
        
                    data = await postRepository.findMyPage(userId, page, count, orderKey, order);
                    try {
                        if (userId !== data[0].userId) {
        										//다른 사람이 나의 게시물을 조회하면 포인트 지급
                            exception.MoodPoint.whenLookMyCloser(data[0].userId);
                        }
                    } catch (err) {}
                    break;
                }
                case 'like': {
                    data = await postRepository.findLikePage(userId, page, count, orderKey, order, gender);
        
                    break;
                }
                case 'search': {
                    switch (sort) {
                        case 'title': {
                            data = await postRepository.findSearchTitleKeyword(
                                keyword,
                                page,
                                count,
                                orderKey,
                                order,
                                gender
                            );
        
                            break;
                        }
                        case 'writer': {
                            data = await postRepository.findSearchWriterKeyword(keyword, page, count);
        
                            break;
                        }
                    }
        
                    break;
                }
                case 'alg': {
                    data = await postRepository.findAlgorithmPost(page, count);
                    break;
                }
                default: {
                    data = await postRepository.findAllPosts(page, count, orderKey, order, gender);
        
                    break;
                }
            }
            try {
                data = data.map((e) => e.get({ plain: true }));
            } catch (err) {
                throw new exception.NotFoundException('검색내용 없음');
            }
        
            return data;
        };
        ```
        
        ```mermaid
        graph TD
          Mermaid --> Diagram
        ```
        
</aside>

---

<aside>
✅ 결과

- 프론트에서 ?type=like&page=1&count=8 같은 정해진 규칙으로 query 변수를 전달해주면 해당 조건에서 필터링 된 게시물을 출력하는 데 성공.
- api를 하나로 줄이는 데 성공.

### 현재 api명세

![현재의 api명세.PNG](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ee2b4e78-37ec-4642-bcf5-e1cb2950f495/%ED%98%84%EC%9E%AC%EC%9D%98_api%EB%AA%85%EC%84%B8.png)

</aside>

### 회원가입 / 로그인

<aside>
❓ 주어진 문제와 요구사항

- 기존
    - 회원가입을 실제로 존재하지 않는 이메일으로 회원가입을 할 수 있음 (회원가입)
    - 비밀번호를 잊었을 때 찾을수있는 수단이 없음 (비밀번호 찾기)
    - 비밀번호를 틀렸을 때 계속 비밀번호를 시도할 수 있음 (로그인)
- 고민
    - 한 사람이 여러 계정을 가지고 좋아요를 누를수 있다 (회원가입)
    - 이메일정보가 실존하지 않기때문에 그 사람이 누구인지 알 수 없어서 게시글에 문제되는사진을 올리거나 댓글에 욕을 할 수 있는 가능성이 있다 (회원가입)
    - 사용자가 비밀번호를 잊어버렸을 때 더이상 그 계정을 사용하지 못하는 경우가 발생한다 (비밀번호 찾기)
    - 해커가 악의적으로 해킹을 위해 무차별 대입을 통해 계정을 탈취할수 있는 경우가 발생한다 (로그인)
- 결정
    - Nodemailer를 사용하여 인증번호 방식을 통해 실제 존재하는 이메일으로만 회원가입을 할 수 있게 구현 결정 (회원가입)
    - 비밀번호 찾기 기능을 만들어서 사용자가 비밀번호를 잊어버렸을때 비밀번호를 변경할수 있도록 구현 결정 (비밀번호 찾기)
    - 비밀번호 시도에 제한을 둬서 비밀번호를 5회이상 틀렸을 때 로그인을 10분간 할 수 없도록 구현 결정 (로그인)
</aside>

---

<aside>
💡 가설

- 구현 가능한 방법 (회원가입 / 비밀번호찾기)
    - 1. Nodemailer를 통해 해당 이메일에 인증번호를 보내고 해당 이메일에 인증번호를 해시화하여 DB에 저장
    - 2. 인증번호가 DB 해당이메일에 저장된 인증번호와 일치시 회원가입 및 비밀번호찾기 성공
- 주기적인 인증번호 청소 (회원가입 / 비밀번호찾기)
    - Node-schedule를 사용하여 10분이 지나면 인증번호 만료로 인식후 DB에서 해당 이메일의 인증번호 삭제
- 구현 가능한 방법 (로그인)
    - 로그인시 이메일과 비밀번호가 일치하지 않는다면 해당 이메일에 실패카운트를 1개씩 늘린다
    - 실패카운트가 5회이상일 경우 10분간 로그인이 불가능하게 한다
</aside>

---

<aside>
✅ 결과

- 무분별한 좋아요 불가 (회원가입)
- 게시글에 문제되는사진 댓글에 욕 작성 등 불법행동시 이메일 특정 후 신고 가능 (회원가입)
- 비밀번호를 잊었을때 찾을수 있음 (비밀번호 찾기)
- 해커가 무차별 대입을통한 계정 탈취를 할 수 없음 (로그인)
</aside>
