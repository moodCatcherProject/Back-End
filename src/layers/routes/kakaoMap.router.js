const router = require('express').Router();
const kakaoController = require('../controllers/kakaoMap.controller');

router.post('/', kakaoController.updatePosition);

module.exports = router;
