const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../../middlewares/auth');

// controllers
const {
	create,
	listByCount,
	getTotalCount,
	listAll,
	listRelated,
	remove,
	read,
	update
} = require('../../controllers/project');

// routes
router.post('/project', authCheck, adminCheck, create);
router.get('/projects/total', getTotalCount);
router.get('/projects/:count', listByCount);
router.get('/projects/all', listAll);
router.get('/projects/related/:project_id', listRelated);
router.delete('/project/:slug', authCheck, adminCheck, remove);
router.get('/project/:slug', read);
router.put('/project/:slug', authCheck, adminCheck, update);

module.exports = router;
