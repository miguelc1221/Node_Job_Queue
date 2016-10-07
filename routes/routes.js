const express = require('express');
const router = express.Router();
const request = require('request');
const validUrl = require('valid-url');

const kue = require('kue'); // job queue module
const jobs = kue.createQueue({  // create queue
    disableSearch: false  //  enable search indexes
});

const dev_url = 'http://localhost:3000';

router.post('/job', (req, res) => {
	const url = req.body.url_term;

	const job = jobs.create('url_worker', {  // create job
		title: "url html",
		url: url
	}).ttl(milliseconds).save();

	job
		.on('complete', (results) => {
			res.redirect('/');
		})
		.on('failed', () => {
			console.log('failed')
		})

});

// get root file
router.get('/', function(req, res) {
	// get all job ids in the queue
	request(`${dev_url}/job/search?q=url html`, (error, response, body) => {
		res.render('index', { jobResults: JSON.parse(body) || [] });
	});
});

// Process each job in the queue (20 active jobs at a time)
jobs.process('url_worker', 20, (job, done) => {
	let url = job.data.url;

	// if the given url is valid, run the request
  if (validUrl.isUri(url)){
		request({ uri: url }, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				return  done(null, body);
			}
		});
	}
		// job fail
	  return done(new Error('invalid url'));
});

module.exports = router;
