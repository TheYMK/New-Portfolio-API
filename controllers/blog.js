const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const formidable = require('formidable');
const slugify = require('slugify');
const stripHtml = require('string-strip-html');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');
const User = require('../models/user');

exports.create = async (req, res) => {
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: 'Something wrong happened'
			});
		}
		const { title, body, categories, tags, images } = fields;

		if (!title || !title.length) {
			return res.status(400).json({
				error: 'title is required'
			});
		}

		if (!body || body.length < 200) {
			return res.status(400).json({
				error: 'Content is too short'
			});
		}

		if (!categories || categories.length === 0) {
			return res.status(400).json({
				error: 'At least one category is required'
			});
		}

		if (!tags || tags.length === 0) {
			return res.status(400).json({
				error: 'At least one tag is required'
			});
		}

		if (!images || images.length === 0) {
			return res.status(400).json({
				error: 'At least one image is required'
			});
		}

		let blog = new Blog();
		blog.title = title;
		blog.body = body;
		blog.images = images;
		blog.excerpt = smartTrim(body, 320, ' ', ' ...');
		blog.slug = slugify(title).toLowerCase();
		blog.mtitle = `${title} | ${process.env.APP_NAME}`;
		blog.mdesc = stripHtml(body.substring(0, 160)).result;
		blog.postedBy = 'Kaym Kassai';

		// categories and tags
		let arrayOfCategories = categories && categories.split(',');
		let arrayOfTags = tags && tags.split(',');

		blog.save((err, result) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err)
				});
			}

			Blog.findByIdAndUpdate(
				result._id,
				{ $push: { categories: arrayOfCategories } },
				{ new: true }
			).exec((err, result) => {
				if (err) {
					return res.status(400).json({
						error: errorHandler(err)
					});
				} else {
					Blog.findByIdAndUpdate(
						result._id,
						{ $push: { tags: arrayOfTags } },
						{ new: true }
					).exec((err, result) => {
						if (err) {
							return res.status(400).json({
								error: errorHandler(err) // only used for mongoose errors
							});
						} else {
							res.json(result);
						}
					});
				}
			});
		});
	});
};

exports.list = async (req, res) => {
	Blog.find({})
		.populate('categories', '_id name slug')
		.populate('tags', '_id name slug')
		.select('_id title slug excerpt categories tags postedBy createdAt images updatedAt')
		.exec((err, data) => {
			if (err) {
				return res.status(400).json({
					error: errorHandler(err)
				});
			}

			res.json(data);
		});
};

exports.getTotalCount = async (req, res) => {
	try {
		const totalCount = await Blog.find({}).estimatedDocumentCount().exec();

		res.json(totalCount);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};
