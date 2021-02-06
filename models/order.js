const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
	{
		// order
		order_type: {
			type: String,
			enum: [ 'basic', 'standard', 'premium', 'ultimate' ],
			required: true
		},
		order_price: {
			type: Number,
			default: 0
		},
		business_description: {
			type: String,
			maxlength: 10000
		},
		current_website_description: {
			type: String,
			maxlength: 10000
		},
		project_description: {
			type: String,
			maxlength: 10000
		},

		features_description: {
			type: String,
			maxlength: 10000
		},
		audience_description: {
			type: String,
			maxlength: 10000
		},
		budget_and_deadline_description: {
			type: String,
			maxlength: 10000
		},
		//personal
		client_fullname: {
			type: String,
			required: true
		},
		client_email: {
			type: String,
			required: true
		},
		client_phone_number: {
			type: String,
			required: true
		},
		order_status: {
			type: String,
			default: 'In Review',
			enum: [ 'In Review', 'Approved', 'Processing', 'On Hold', 'Cancelled', 'Completed' ],
			required: true
		}
		// payment_intent: {},

		// orderedBy: { type: ObjectId, ref: 'User' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
