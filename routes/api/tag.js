const express = require('express');
const router = express.Router();

// controllers
const { authCheck, adminCheck } = require('../../middlewares/auth');
const { create, list, read, remove } = require('../../controllers/tag');

// validators
const { runValidation } = require('../../validators/index');
const { tagCreateValidator } = require('../../validators/tag');

router.post('/tag', tagCreateValidator, runValidation, authCheck, adminCheck, create);
router.get('/tags', list);
router.get('/tag/:slug', read);
router.delete('/tag/:slug', authCheck, adminCheck, remove);

module.exports = router;
