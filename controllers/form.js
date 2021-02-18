const { sendEmailWithNodemailer } = require('../helpers/email');

exports.contactForm = (req, res) => {
	console.log(req.body);
	const { name, email, message, subject } = req.body;

	const emailData = {
		from: process.env.EMAIL, // MAKE SURE THIS EMAIL IS YOUR GMAIL FOR WHICH YOU GENERATED APP PASSWORD
		to: process.env.EMAIL, // WHO SHOULD BE RECEIVING THIS EMAIL? IT SHOULD BE YOUR GMAIL
		subject: `Kaym's Portfolio | Contact Form`,
		text: `Email received from contact from \n Sender name: ${name} \n Sender email: ${email} \n Sender message: ${message}`,
		html: `
        <h4>Email received from contact form:</h4>
		<p><strong>Subject: ${subject}</strong></p>
        <hr/>
        <p><strong>Sender name:</strong> ${name}</p>
        <p><strong> Sender email:</strong> ${email}</p>
        <p><strong>Sender message:</strong> <br/> ${message}</p>
        <hr />
        <p>This email may contain sensitive information</p>
        <p>https://kaymkassai.tech</p>
    `
	};

	sendEmailWithNodemailer(req, res, emailData);
};
