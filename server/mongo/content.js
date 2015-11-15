"use strict";

let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blogs');

var blogtxt = new mongoose.Schema({
	id:Number,
	title: String,
	content: String,
	createtime: { type: Date, default: new Date() },
	author: { type: String, default: 'Kevin' }
});

var comment = new mongoose.Schema({
	id:Number,
	targetid:Number,
	content:String,
	createtime:{ type: Date, default: new Date() },
	author:{ type: String, default: 'none' },
})


var piclife = new mongoose.Schema({
	id:Number,
	title: String,
	content: String,
	path:String,
	createtime: { type: Date, default: new Date() },
	author: { type: String, default: 'Kevin' }
});

mongoose.model('Blogtxt', blogtxt);
mongoose.model('Piclife', piclife, 'piclifes');
mongoose.model('Comment', comment);
