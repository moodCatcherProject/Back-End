const router = require('express').Router();
const noticeController = require('../controllers/notice.controller');

//모든 알림 가져오기 (/api/notice)
router.get('/', noticeController.findAllNotice);

//모든 알림 삭제하기 (/api/notice)
router.delete('/', noticeController.deleteAllNotice);

module.exports = router;
