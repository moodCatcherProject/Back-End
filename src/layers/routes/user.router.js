const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const exception = require('../exceptModels/_.models.loader');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');
const Upload = require('./middlewares/postImageUploadMiddleware');
const upload = new Upload();

// 유저 정보 조회(/api/users/:userId)
userRouter.get('/:userId', isLoggedIn, userController.getUser);

// 유저 정보 수정(/api/users)
userRouter.put('/', isLoggedIn, upload.upload.single('userValue'), userController.updateUser);

// 프로필 아이콘 변경(/api/users)
userRouter.patch('/', isLoggedIn, userController.updateProfileIcon);

// 회원탈퇴 (/api/users/signout)
userRouter.delete('/signout', isLoggedIn, upload.delete_profile, userController.deleteUser);

module.exports = userRouter;
