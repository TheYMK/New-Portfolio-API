const express = require('express');
const router = express.Router();

// controllers
const {
	create,
	list,
	getTotalCount,
	listAllBlogsCategoriesTags,
	read,
	remove,
	update,
	listRelated
} = require('../../controllers/blog');

// middlewares
const { authCheck, adminCheck } = require('../../middlewares/auth');

// routes
router.post('/blog', authCheck, adminCheck, create);
router.get('/blogs', list);
router.get('/blogs/total', getTotalCount);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', authCheck, adminCheck, remove);
router.put('/blog/:slug', authCheck, adminCheck, update);
router.post('/blog/related', listRelated);

module.exports = router;
