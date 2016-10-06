const express = require('express');
const router = express.Router();

router.get('/job', (req, res, next) => {
    console.log('job')
});

module.exports = router;
