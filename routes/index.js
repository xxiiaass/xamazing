'use strict';

var express = require('express');
var router = express.Router();
var Blog = require('../server/content/blog');
var Piclife = require('../server/content/pic')
let url = require('url');
let PathFunc = require('path');

/* GET home page. */ 
router.get('/', function(req, res) {
	let guard = 0;
	let blogs, pic;
	Piclife.getCurrent(3).then(doc=>{
		pic = doc;
		if( ++guard == 2 )
			res.render('top/index.ejs',{'blog':blogs, 'piclife':pic, 'jspath':'/top/top-main.js'});
	});

	Blog.getCurrent(4).then(doc=>{
		blogs = doc;
		if( ++guard == 2 ) 
			res.render('top/index.ejs',{'blog':blogs, 'piclife':pic, 'jspath':'/top/top-main.js'});
	})
});

router.get('/blog', (req, res)=>{
	Blog.getRang(0, 10).then(doc=>{
		res.render('top/blog/blog.ejs', {'blog':doc, 'jspath':'/top/blog/blog-main.js'});
	});
})



router.get('/singleblog', (req, res)=>{
	let urljson = url.parse(req.url, true).query;
	if( /\D/.test(urljson.blogid)){
		res.end();
		return ;
	}
	Blog.getById(urljson.blogid).then(doc=>{
		res.render('top/blog/singleblog/singleblog.ejs', {'blog':doc, 'jspath':'/top/blog/singleblog/singleblog-main.js'});		
	})
})

router.get('/piclife', (req, res)=>{
	Piclife.getCurrent(5).then(doc=>{
		res.render('top/piclife/piclife.ejs', {'piclife':doc, 'jspath':'/top/piclife/piclife-main.js'});
	});
})

router.get('/singlepic', (req, res)=>{
	let urljson = url.parse(req.url, true).query;
	if( /\D/.test(urljson.picid)){
		res.end();
		return ;
	}
	Piclife.getById(urljson.picid).then(doc=>{
		res.render('top/piclife/singlepic/singlepic.ejs', {'singlepic':doc, 'jspath':'/top/piclife/singlepic/singlepic-main.js'});		
	});
})

module.exports = router;

