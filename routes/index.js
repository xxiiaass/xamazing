'use strict';

var express = require('express');
var router = express.Router();
var Blog = require('../server/content/blog');
var Piclife = require('../server/content/pic')
var MenuMark = require('../server/content/note').MenuMark;
var ListMark = require('../server/content/note').ListMark;
var Note = require('../server/content/note').Note;
let url = require('url');

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

router.get('/code', (req, res)=>{
	var menumark = new MenuMark('./mkdown');
	menumark.readDir().then(doc=>{
		res.render('top/code/code.ejs', {'menus':doc, 'jspath':'/top/code/code-main.js'});
	});
})

router.get('/code/getlist', (req, res)=>{
	let urljson = url.parse(req.url, true).query;
	var listmark = new ListMark(urljson.listname);
	listmark.allMarkFile().then(doc=>{
		res.send(doc);
	});
})

router.get('/code/getfiletext', (req, res)=>{
	let urljson = url.parse(req.url, true).query;
	var note = new Note(urljson.filepath);
	note.getMarkdown().then(doc=>{
		console.log(doc);
		res.send(doc);
	});
})

router.get('/test', (req, res)=>{
	var menumark = new MenuMark('./mkdown');
	menumark.getList().then(doc=>{
		return doc[3].allMarkNote();
	}).then(doc=>{
		console.log(doc);
	})
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

