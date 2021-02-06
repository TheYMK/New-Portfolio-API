const Order = require('../models/order');
const { sendEmailWithNodemailer } = require('../helpers/email');

exports.create = async (req, res) => {
	try {
		const newOrder = await new Order(req.body).save();

		if (req.body.order_type) {
			const { client_fullname, client_email, client_phone_number } = req.body;

			const emailData = {
				from: process.env.EMAIL, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
				to: process.env.EMAIL, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
				subject: `Client Request - ${req.body.order_type.toUpperCase()} Package | Kaym.js`,
				text: `You have a new project request | ${req.body.order_type.toUpperCase()} Package`,
				html: `
				<h4>You have a new project request.</h4>
				<p>Check your admin <a href="https://kaymkassai.tech/admin/dashboard">dashboard</a> for more details about the project request.</p>
				
				<p><strong>Client full name:</strong> ${client_fullname}</p>
				<p><strong>Client email:</strong> ${client_email}</p>
				<p><strong>Client phone number:</strong> ${client_phone_number}</p>
				<hr />
				<p>https://kaymkassai.tech/</p>
			`
			};
			sendEmailWithNodemailer(req, res, emailData);
		}

		res.json(newOrder);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.listAll = async (req, res) => {
	try {
		const orders = await Order.find({});
		res.json(orders);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.read = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id);
		res.json(order);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.updateStatus = async (req, res) => {
	try {
		// console.log(`Status changed to: ${req.body.order_status}`);
		const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();

		res.json({ success: true });
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message,
			success: false
		});
	}
};

exports.updatePrice = async (req, res) => {
	try {
		const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();

		res.json({ success: true });
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message,
			success: false
		});
	}
};

exports.removeOrder = async (req, res) => {
	try {
		const removed = await Order.findByIdAndRemove(req.params.id);
		res.json({ success: true });
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message,
			success: false
		});
	}
};
