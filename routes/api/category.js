const express = require('express');
const router = express.Router();

// controllers
const { authCheck, adminCheck } = require('../../middlewares/auth');
const { create, list, read, remove } = require('../../controllers/category');

// validators
const { runValidation } = require('../../validators/index');
const { categoryCreateValidator } = require('../../validators/category');

router.post('/category', categoryCreateValidator, runValidation, authCheck, adminCheck, create);
router.get('/categories', list);
router.get('/category/:slug', read);
router.delete('/category/:slug', authCheck, adminCheck, remove);
module.exports = router;
