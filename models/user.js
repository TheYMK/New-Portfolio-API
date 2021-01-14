const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		name: String,
		email: {
			type: String,
			required: true,
			index: true
		},
		role: {
			type: String,
			default: 'subscriber'
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
