const router = require('express').Router();
const Controller = require('../controllers');

router.get('/rooms', Controller.getRooms);
router.post('/rooms', Controller.addRoom);

module.exports = router;
