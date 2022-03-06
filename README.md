# node_boilerplate

Node.js 작업 시 주로 사용하는 패키지들을 모아두는 레포지토리입니다.  
프론트엔드 처리 부분은 일단 Pug를 사용했습니다.

## npm packages

- express
- @babel/node
- @babel/preset-env
- @babel/core
- nodemon
- morgan
- pug
- mongoose
- express-session
- connect-mongo
- multer

## requirement file

- babel.config.json
- nodemon.json

## 구현한 기능

- [x] 회원가입
- [ ] 회원가입 시 이메일 인증 요청
- [x] 로그인
- [ ] 소셜 로그인
- [x] 이메일, 이름 변경
- [x] 비밀번호 암호화 및 변경
- [ ] 유저 완전 탈퇴
- [x] 유저 프로필 사진 업로드 및 수정
- [x] 보드 업로드
- [ ] 보드 검색
- [x] 보드 삭제
- [x] 보드 페이지
- [x] 보드 수정
- [x] 유저 방
- [ ] 유저 방 사진 업로드 및 수정
- [x] 좋아요 기능 - modal 기능과 함께 누가 좋아요 했는지 보여주기 / 좋아요 해제 시 redirect
- [x] 스크랩 기능
- [x] 스크랩 한 보드 조회 / 스크랩 해제 시 redirect
- [x] 유저 차단
- [x] 차단된 유저 조회
- [x] 유저 차단 해제
- [x] 유저 팔로우 대기 생성 / 유저 팔로우
- [x] 팔로우하지 않거나 차단된 유저에게는 프로필, 보드 블록 처리 / 프로필 완전 공개 or 비공개 설정
- [x] 팔로우 요청한 유저 수가 1명 이상일 때 user-profile 화면에서 css로 알림
- [ ] 유저 간 채팅
- [ ] 홈 보드, 유저가 올린 보드 Pagenation
- [ ] 보드 댓글 기능
- [ ] 댓글에 대한 좋아요, 댓글 기능
- [ ] 팔로우, 좋아요, 댓글, 채팅 request 시 owner에게 alert
- [ ] 해시태그 추가 및 해시태그로 검색
- [ ] 시간, 숫자에 대한 view formatting
- [ ] 댓글에 특정 username 언급 시 강조 및 해당 user profile로 이동될 수 있도록 링크 추가
