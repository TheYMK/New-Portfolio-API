const Tag = require('../models/tag');
// const Blog = require('../models/blog');
const slugify = require('slugify'); // to create more readble urls
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
	const { name } = req.body;
	let slug = slugify(name).toLowerCase();

	let tag = new Tag({ name, slug });

	tag.save((err, data) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}

		res.json(data);
	});
};

exports.list = (req, res) => {
	Tag.find({}).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}

		res.json(data);
	});
};

exports.read = (req, res) => {
	const slug = req.params.slug.toLowerCase();

	Tag.findOne({ slug }).exec((err, tag) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		// return the blogs associated with this category also
		// 	Blog.find({ categories: category })
		// 		.populate('categories', '_id name slug')
		// 		.populate('tags', '_id name slug')
		// 		.populate('postedBy', '_id name')
		// 		.select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
		// 		.exec((err, data) => {
		// 			if (err) {
		// 				return res.status(400).json({
		// 					error: errorHandler(err)
		// 				});
		// 			}

		// 			res.json({ category: category, blogs: data });
		// 		});
		res.json(tag);
	});
};

exports.remove = (req, res) => {
	const slug = req.params.slug;

	Tag.findOneAndRemove({ slug }).exec((err, data) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}
		res.json({
			message: 'Tag deleted successfully'
		});
	});
};
