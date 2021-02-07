const router = require('express').Router();
const Controller = require('../controllers');

router.get('/rooms', Controller.getRooms);

module.exports = router;
