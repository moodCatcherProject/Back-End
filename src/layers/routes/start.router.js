const express = require('express');
const router = express.Router();
const startController = require('../controllers/start.controller');
const gwonsTest = require('../../../test/dbMockData');

router.get('/', startController.findRandomStartMessage);
router.post('/test', gwonsTest.createTestDatabase);

router.get('/mood', startController.testMoodPoint);
module.exports = router;
