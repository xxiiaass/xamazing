'use strict';

var express = require('express');
var router = express.Router();
var blog= require('../server/centent/blog');
var piclife = require('../server/centent/piclife');

/* GET home page. */
router.get('/', function(req, res, next) {
	let guard = 0;
	let blogs, pic;
	piclife.getcurrentpic(3, doc=>{
		console.log(doc);
		pic = doc;
		if( ++guard == 2 ) 
			res.render('top/top.ejs',{'blog':blogs, 'piclife':pic});
	});

	blog.getcurrentblog(2, doc=>{
		blogs = doc;
		if( ++guard == 2 ) 
			res.render('top/top.ejs',{'blog':blogs, 'piclife':pic});
	})
});

module.exports = router;

