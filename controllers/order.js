const Order = require('../models/order');

exports.create = async (req, res) => {
	try {
		const newOrder = await new Order(req.body).save();
		res.json(newOrder);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};
