const router = require('express').Router();
const kakaoController = require('../controllers/kakaoMap.controller');

router.patch('/', kakaoController.updatePosition);

router.get('/', kakaoController.findAroundCatcher);
module.exports = router;
