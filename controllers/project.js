const Project = require('../models/project');
const slugify = require('slugify');

exports.create = async (req, res) => {
	try {
		req.body.slug = slugify(req.body.name);
		const newProject = await new Project(req.body).save();
		res.json(newProject);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.getTotalCount = async (req, res) => {
	try {
		const totalCount = await Project.find({}).estimatedDocumentCount().exec();

		res.json(totalCount);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.listByCount = async (req, res) => {
	try {
		const projects = await Project.find({})
			.limit(parseInt(req.params.count))
			.sort([ [ 'createdAt', 'desc' ] ])
			.exec();

		res.json(projects);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.listAll = async (req, res) => {
	try {
		const projects = await Project.find({}).exec();

		res.json(projects);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.listRelated = async (req, res) => {
	try {
		const project = await Project.findById(req.params.project_id);

		const relatedProjects = await Project.find({ _id: { $ne: project._id }, category: project.category })
			.limit(4)
			.exec();

		res.json(relatedProjects);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.remove = async (req, res) => {
	try {
		const removedProject = await Project.findOneAndRemove({ slug: req.params.slug });

		res.json(removedProject);
	} catch (err) {
		console.log(`====> ${err}`);
		a;
		res.status(400).json({
			error: err.message
		});
	}
};

exports.read = async (req, res) => {
	try {
		const project = await Project.findOne({ slug: req.params.slug }).exec();

		res.json(project);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};

exports.update = async (req, res) => {
	try {
		if (req.body.name) {
			req.body.slug = slugify(req.body.name);
		}

		const updated = await Project.findOneAndUpdate({ slug: req.params.slug }, req.body, { new: true }).exec();

		res.json(updated);
	} catch (err) {
		console.log(`====> ${err}`);
		res.status(400).json({
			error: err.message
		});
	}
};
