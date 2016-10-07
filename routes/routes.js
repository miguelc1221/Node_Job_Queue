const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const validUrl = require('valid-url');
const url = require('url');

const kue = require('kue'); // job queue module
const jobs = kue.createQueue({  // create queue
    disableSearch: false  //  enable search indexes
});

const milliseconds = 5;
let error;

router.post('/job', (req, res) => {
	const url = req.body.url_term;
	// search validation (Don't submit empty form')
	if (!url) {
		error = "Can't submit an empty form"
		return res.redirect('/');
	}
	// search validation (Don't submit a nonvalid url')
	if (!validUrl.isUri(url)) {
		error = "Please Enter a Valid URL";
		return res.redirect('/');
	}

	// create job
	const job = jobs.create('url_worker', {
		title: "url html",
		url: url
	}).ttl(milliseconds).save();

	job
		.on('complete', (results) => {
			error = ''
			return res.redirect('/');
		})
		.on('failed', (err) => {
			console.log(err)
			return res.redirect('/');
		})

});

// get selected job status
router.get('/job/:id', (req, res) => {
	// clear errors on page switch
	error = ''
	const id = req.params.id;
	// get my url for request(rp)
	const requrl = url.format({
  	protocol: req.protocol,
    host: req.get('host')
	});
	// get all job ids in the queue
	rp(`${requrl}/kue/job/${id}`)
		.then((response) => {
			// if id does exist, redirect home
			const parseResponse = JSON.parse(response);
			// if error is not a "failed job", redirect home
			if (parseResponse.error && !parseResponse.id) return res.redirect('/');
			// else save the response and show the status from response
			let selected_id = parseResponse;
			return res.render('jobStatus.ejs', { selected_id: selected_id });
		})
		.catch((err) => {
			return res.render('notFound')
		});
});

// get root file
router.get('/', (req, res) => {
	// get my url for request(rp)
	const requrl = url.format({
  	protocol: req.protocol,
    host: req.get('host')
	});

	// get all job ids in the queue
	rp(`${requrl}/kue/job/search?q=url html`)
		.then((response) => {
			let ids = JSON.parse(response);
			return res.render('index', { jobIds: ids || [], error: error || '' });
		})
		.catch((err) => {
			return res.render('error')
		})
});

// Process each job in the queue (20 active jobs at a time)
jobs.process('url_worker', 20, (job, done) => {
	let url = job.data.url;
	// request the url that user submitted
	rp({ uri: url })
		.then((res) => {
			return done(null, res)
		})
		.catch((err) => {
			return done(new Error('Error occurred'));
		});
});

module.exports = router;
