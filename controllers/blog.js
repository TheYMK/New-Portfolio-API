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
		const { title, body, categories, tags, image } = fields;

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

		if (!image || !image.length) {
			return res.status(400).json({
				error: 'An image is required'
			});
		}

		let blog = new Blog();
		blog.title = title;
		blog.body = body;
		blog.image = image;
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
		.select('_id title slug excerpt categories tags postedBy createdAt image updatedAt')
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

exports.listAllBlogsCategoriesTags = (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 10;
	let skip = req.body.skip ? parseInt(req.body.skip) : 0;

	let blogs;
	let categories;
	let tags;

	Blog.find({})
		.populate('categories', '_id name slug')
		.populate('tags', '_id name slug')
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.select('_id title slug excerpt categories tags postedBy image createdAt updatedAt')
		.exec((err, data) => {
			if (err) {
				return res.json({
					error: errorHandler(err)
				});
			}
			blogs = data; // blogs
			// get all categories
			Category.find({}).exec((err, c) => {
				if (err) {
					return res.json({
						error: errorHandler(err)
					});
				}
				categories = c; // categories
				// get all tags
				Tag.find({}).exec((err, t) => {
					if (err) {
						return res.json({
							error: errorHandler(err)
						});
					}
					tags = t;
					// return all blogs categories tags
					res.json({ blogs, categories, tags, size: blogs.length });
				});
			});
		});
};

exports.read = (req, res) => {
	const slug = req.params.slug.toLowerCase();

	Blog.findOne({ slug })
		.populate('categories', '_id name slug')
		.populate('tags', '_id name slug')
		.select('_id title body slug mtitle mdesc categories tags postedBy image createdAt updatedAt')
		.exec((err, data) => {
			if (err) {
				return res.json({
					error: errorHandler(err)
				});
			}
			res.json(data);
		});
};

exports.remove = (req, res) => {
	const slug = req.params.slug.toLowerCase();
	console.log(slug);
	Blog.findOneAndRemove({ slug }).exec((err, data) => {
		if (err) {
			return res.json({
				error: errorHandler(err)
			});
		}

		res.json({
			sucess: true
		});
	});
};

exports.update = (req, res) => {
	const slug = req.params.slug.toLowerCase();

	Blog.findOne({ slug }).exec((err, oldBlog) => {
		if (err) {
			return res.status(400).json({
				error: errorHandler(err)
			});
		}

		let form = new formidable.IncomingForm();

		form.keepExtensions = true;

		form.parse(req, (err, fields, files) => {
			console.log(fields);
			if (err) {
				return res.status(400).json({
					error: 'Something wrong happened'
				});
			}

			// slug shouldn't change because of the previous slug will be indexed by google and we don't want to change that. So no generation of new slug
			let slugBeforeMerge = oldBlog.slug;
			oldBlog = _.merge(oldBlog, fields);
			oldBlog.slug = slugBeforeMerge;

			const { body, mdesc, categories, tags } = fields;

			if (body) {
				oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
				oldBlog.mdesc = stripHtml(body.substring(0, 160)).result;
			}
			if (categories) {
				oldBlog.categories = categories.split(',');
			}

			if (tags) {
				oldBlog.tags = tags.split(',');
			}

			oldBlog.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: errorHandler(err)
					});
				}

				res.json(result);
			});
		});
	});
};

exports.listRelated = (req, res) => {
	let limit = req.body.limit ? parseInt(req.body.limit) : 4;

	const { _id, categories } = req.body.blog;

	Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
		.limit(limit)
		.populate('categories', '_id name slug')
		.populate('tags', '_id name slug')
		.select('title slug excerpt categories tags image createdAt updatedAt')
		.exec((err, blogs) => {
			if (err) {
				return res.status(400).json({
					error: 'Blogs not found'
				});
			}

			res.json(blogs);
		});
};
