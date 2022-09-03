const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const exception = require('../exceptModels/_.models.loader');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');
const Upload = require('./middlewares/postImageUploadMiddleware');
const upload = new Upload();

// 유저 정보 조회(/api/users/:userId)
userRouter.get('/:userId', userController.getUser);

// 유저 정보 수정(/api/users)
userRouter.put('/', isLoggedIn, upload.upload.single('userValue'), userController.updateUser);

// 로그아웃(/api/users/logout)
userRouter.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).json(new exception.FormDto('로그아웃 성공'));
});

// 회원탈퇴 (/api/users/signout)
userRouter.delete('/signout', isLoggedIn, userController.deleteUser);

module.exports = userRouter;
