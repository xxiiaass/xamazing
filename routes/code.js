'use strict';

var MenuMark = require('../server/content/note').MenuMark;
var ListMark = require('../server/content/note').ListMark;
var checkInputPath = require('../server/content/note').checkInputPath;
var checkOutPath = require('../server/content/note').checkOutPath;
var Note = require('../server/content/note').Note;
var express = require('express');
var router = express.Router();
let url = require('url');
let PathFunc = require('path');
var mkdownpath = PathFunc.normalize(require('../config').mkdownpath);


router.get('/', (req, res)=>{
	var menumark = new MenuMark(checkInputPath(mkdownpath, ''));
	menumark.readDir().then(doc=>{
		res.render('top/code/code.ejs', {'menus':checkOutPath(mkdownpath, doc), 'jspath':'/top/code/code-main.js'});
	});
})

router.get('/getlist', (req, res)=>{
	let urljson = url.parse(req.url, true).query;
	var listmark = new ListMark(checkInputPath(mkdownpath, urljson.listname));
	listmark.allMarkFile().then(doc=>{
		res.send(checkOutPath(mkdownpath, doc));
	});
})

router.get('/getfiletext', (req, res)=>{
	let urljson = url.parse(req.url, true).query;
	var note = new Note(checkInputPath(mkdownpath, urljson.filepath));
	note.getMarkdown().then(doc=>{
		res.send(doc);
	});
})


module.exports = router;