const express = require('express');
const router = express.Router();

// controllers
const { contactForm } = require('../../controllers/form');

// validators
const { runValidation } = require('../../validators');
const { contactFormValidator } = require('../../validators/form');

router.post('/contact', contactFormValidator, runValidation, contactForm);

module.exports = router;
