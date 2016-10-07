const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const kue = require('kue');

const app = express();
const PORT = 3000;
const isProduction = process.env.NODE_ENV === 'production';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app Setup
app.use(bodyParser.json());
// extract data from the <form> element and add them to the request object.
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// routes
const appRoutes = require('./routes/routes');
app.use('/', appRoutes);
app.use('/kue', kue.app); // kue ui interface

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
if (!isProduction) {
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('notFound', {
		message: err.message,
		error: {}
	});
});

// start server
app.listen(PORT, (err) => {
	if (err) {
		console.log(err);
		return;
	}

	console.log('Listening at http://localhost: ' + PORT);
});