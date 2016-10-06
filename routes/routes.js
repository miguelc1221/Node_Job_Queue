const express = require('express');
const router = express.Router();
const request = require('request');

const kue = require('kue');
const jobs = kue.createQueue();

router.post('/job', (req, res) => {
	const url = req.body.url_term;
	const job = jobs.create('url_worker', { url: url });

	job
		.on('complete', (results) => {
			console.log('complete')
			console.log(job.id)
			res.render('index', { results: results })
		})
		.on('failed', () => {
			console.log('failed')
		})
		.on('progress', (progress, data) => {
  		console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data );
		})

		job.save()
});

jobs.process('url_worker', (job, done) => {
 /* carry out all the job function here */
	const results = request({ uri: job.data.url }, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			return done && done(null, body);
		}
	})
});

module.exports = router;
