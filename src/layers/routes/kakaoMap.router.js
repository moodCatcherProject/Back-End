const router = require('express').Router();
const kakaoController = require('../controllers/kakaoMap.controller');

// 유저 좌표 업데이트(/api/map)
router.patch('/', kakaoController.updatePosition);

// 주변 사람 유저 정보 가져오기(/api/map)
router.get('/', kakaoController.findAroundCatcher);

// 무드 맵 ON/OFF(/api/map/on-off)
router.patch('/on-off', kakaoController.onOffMap);

module.exports = router;
