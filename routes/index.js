'use strict';

var express = require('express');
var router = express.Router();
var blog= require('../server/centent/blog');
var piclife = require('../server/centent/piclife');
let url = require('url');

/* GET home page. */
router.get('/', function(req, res, next) {
	let guard = 0;
	let blogs, pic;
	piclife.getcurrentpic(3, doc=>{
		pic = doc;
		if( ++guard == 2 ) 
			res.render('top/top.ejs',{'blog':blogs, 'piclife':pic});
	});

	blog.getcurrentblog(4, doc=>{
		blogs = doc;
		if( ++guard == 2 ) 
			res.render('top/top.ejs',{'blog':blogs, 'piclife':pic});
	})
});

router.get('/blog', (req, res, next)=>{
	blog.getblog({}, doc=>{
		res.render('top/blog/blog.ejs', {'blog':doc});
	})
})

router.get('/singleblog', (req, res, next)=>{
	let urljson = url.parse(req.url, true).query;
	blog.getblog(urljson.blogid, doc=>{
		res.render('top/blog/singleblog/singleblog.ejs', {'blog':doc});		
	})
})

router.get('/piclife', (req, res, next)=>{
	piclife.getpiclife({}, doc=>{
		res.render('top/piclife/piclife.ejs', {'piclife':doc});
	})
})

router.get('/singlepic', (req, res, next)=>{
	let urljson = url.parse(req.url, true).query;
	piclife.getpiclife(urljson.picid, doc=>{
		console.log(doc[0].path);
		res.render('top/piclife/singlepic/singlepic.ejs', {'singlepic':doc});		
	})
})


module.exports = router;

