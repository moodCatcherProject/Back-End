온라인으로 공부하고 싶다면? 👨‍Stupy
그림11


📌 바로가기
사이트 바로가기 : https://www.stupy.co.kr
프론트엔드 GitHub Repository : x
백엔드 GitHub Respository : https://github.com/ConfusedPandaEvan/study_people
시연 영상 보러가기: x
발표 영상 보러가기: x

⏱ 프로젝트 기간
2022.06.24 ~ 2022.08.5 (6주)


👾 BACKEND MEMBERS
임현우
스터디룸 CRUD Todo & Todo List CRUD CICD 환경 구축 https 적용
Multer 이미지 관리 배포환경 구축(AWS) 통합 & 해시태그 검색기능
정렬 기능 목업 디자인

김준호
AWS ECS EC2 Redis-Server
타이머 기능 채팅기능 화상채팅기능 소켓관리 Redis-Adaptor
소켓 미들웨어 컨트롤러 GUARD
로그인 소셜로그인기능 카카오톡로그인 네이버로그인


🌈 스투피 서비스 주요기능
🔥 스투피는 반응형으로 웹과 모바일 모두 이용 가능한 서비스입니다.

🔔 자신이 원하는 목적의 스터디 그룹 개설
🔔 자신과 목적이 같은 스터디 그룹 검색 (키워드 및 해시태그 검색) & 참여
🔔 공부 목표 관리를 위한 개인 Todo List 관리
🔔 실시간 화상 및 채팅이 가능한 스터디 그룹
🔔 스터디 룸에서 자신이 공부한 시간 측정 및 경쟁



✨ 아키텍쳐

스투피_최종아키텍처_피드백후


🔨 기술스택
Tech
   
     

📚 라이브러리
name	Appliance	version
cors	CORS 핸들링	2.8.5
mongoose	MongoDB ODM	6.1.1
jsonwebtoken	JWT토큰 발급	8.5.1
multer	파일 업로드	1.4.4
socket.io	실시간 알림	4.5.1
jest	테스트코드	28.0.1
🚀 기술적 도전 및 트러블 슈팅
✅ 서버 성능 개선
도입 이유
서버의 부하를 분산시키고 안정적인 서버 유지를 위해 로드밸런싱 구현의 필요성을 느낌
문제 상황
socket 연결을 통해 실시간 알림기능을 제공하고 있기 때문에 접속자 수 증가에 따라 서버의 부담 증가
해결 방안
AWS의 ECS 기능을 사용하여 Load Balancing 과 서비스의 scale-up 을 동시에 진행할수 있게끔 구현.
결과
실시간으로 끊김현상 없이 scale-up 이 가능한것을 확인 하였으나. 현재의 traffic 으로는 한개의 서버만 구동 하는것이 훨씬 효율적이라는 결론을 내렸다.( ECS 서비스에서는 Limit 을 설정하여 해당 cpu 의 일정부분 이상 사용하는것을 제한하기 때문
✅ 여러대의 서버간의 통신기능 개선
도입 이유
여러대의 서버로 접속하는 소켓들을 하나로 관리하여 EVENTS 를 EMIT 해주어야 될 필요성을 느낌
문제 상황
한대의 서버에서 다른서버로 SOCKET 정보를 보내 줄 방법이 필요함
해결 방안
socket 연결을 REDIS-adaptor 를 통해 하고 다른 서버들에서도 REDIS 서버에 SUB/PUB 방식을 통해 저장된 데이터를 access할수있게 구현
결과
성공적
