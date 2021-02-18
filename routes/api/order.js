const express = require('express');
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require('../../middlewares/auth');

// controllers
const {
	create,
	listAll,
	read,
	updateStatus,
	updatePrice,
	removeOrder,
	getTotalCount
} = require('../../controllers/order');

// routes
router.post('/order', create);
router.get('/orders', listAll);
router.get('/order/:id', read);
router.put('/order/:id/update-status', authCheck, adminCheck, updateStatus);
router.put('/order/:id/update-price', authCheck, adminCheck, updatePrice);
router.delete('/order/:id', authCheck, adminCheck, removeOrder);
router.get('/orders/total', getTotalCount);

module.exports = router;
