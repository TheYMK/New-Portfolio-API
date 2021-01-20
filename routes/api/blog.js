const express = require('express');
const router = express.Router();

// controllers
const { create, list, getTotalCount } = require('../../controllers/blog');

// middlewares
const { authCheck, adminCheck } = require('../../middlewares/auth');

// routes
router.post('/blog', authCheck, adminCheck, create);
router.get('/blogs', list);
router.get('/blogs/total', getTotalCount);

module.exports = router;
