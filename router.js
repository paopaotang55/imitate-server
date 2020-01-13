const express = require('express');
const router = express.Router();
const controller = require('./controller/index');

//유저 로그인 회원가입 회원탈퇴
router.post('/register', controller.users.register);

router.post('/login', controller.users.login);

router.put('/editPassword', controller.users.checkToken, controller.users.editPassword)

router.delete('/deleteUser', controller.users.checkToken, controller.users.deleteUser)

//board 전체가져오기 추가 수정 삭제  
router.get('/getBoards', controller.users.checkToken, controller.boards.getBoards)

router.post('/addBoard', controller.users.checkToken, controller.boards.addBoard)

router.put('/editBoard', controller.users.checkToken, controller.boards.editBoard)

router.delete('/deleteBoard', controller.users.checkToken, controller.boards.deleteBoard)

//container 와 card 전체가져오기 추가 수정 삭제  
router.get('/getContainers', controller.users.checkToken, controller.boards.getContainers)

router.post('/addContainer', controller.users.checkToken, controller.boards.addContainer)

router.post('/addCard', controller.users.checkToken, controller.boards.addCard)

router.delete('/deleteCard', controller.users.checkToken, controller.boards.deleteCard)

router.delete('/deleteContainer', controller.users.checkToken, controller.boards.deleteContainer)

router.put('/editContainer', controller.users.checkToken, controller.boards.editContainer)

router.put('/editCard', controller.users.checkToken, controller.boards.editCard)

module.exports = router;