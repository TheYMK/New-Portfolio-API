const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
			text: true
		},
		category: {
			type: String,
			required: true,
			enum: [ 'Web', 'Mobile', 'Design' ]
		},
		description_frontend: {
			type: String,
			required: true,
			maxlength: 2000,
			text: true // useful for search
		},
		description_backend: {
			type: String,
			required: true,
			maxlength: 2000,
			text: true // useful for search
		},
		description_challenges: {
			type: String,
			required: true,
			maxlength: 2000,
			text: true // useful for search
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			index: true
		},
		images: {
			type: Array
			// required: true
		},
		client: {
			type: String
		},
		url: {
			type: String,
			required: true
		},
		date: {
			type: String
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
