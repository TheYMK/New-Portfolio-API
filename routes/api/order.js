const express = require('express');
const router = express.Router();

// middlewares
// const { authCheck, adminCheck } = require('../../middlewares/auth');

// controllers
const { create } = require('../../controllers/order');

// routes
router.post('/order', create);

module.exports = router;
