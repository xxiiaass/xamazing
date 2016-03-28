'use strict';

var marked = require('marked');
var fs = require('fs');
var Pathfunc = require('path');
var logger = require('log4js').getLogger("note");
var toPro = require('../safe/toPro');
var co = require('co');
var mkdownpath = require('../../config').mkdownpath;

const isDirec = function(path){
	return new Promise((resolve, reject)=>{
		fs.stat(path, (err, stat)=>{
			if(err){
				logger.error(JSON.stringify(err));
				resolve([path, false]);
			}
			else{
				resolve([path, stat.isDirectory()]);
			}
		})
	})
}

var checkInputPath = function (basepath, path ) {
	let targetPath = Pathfunc.join(basepath, path);
	if(targetPath.startsWith(basepath))
		return targetPath;
	else
		return '';
}

var checkOutPath = function ( basepath, path) {
	if(Array.isArray(path)){
		return path.map(x=>{
			return x.substr(x.indexOf(basepath)+basepath.length);
		})
	}
	else
		return path.substr(path.indexOf(basepath)+basepath.length);
}

class Note {
	constructor(path){
		this.path = path;
	}

	getTitle(){
		return Pathfunc.basename(this.path ,'.md');
	}

	getBirthTime(){
		const self = this;
		return new Promise((resolve, reject)=>{
			fs.stat(this.path, (err, stat)=>{
				if(err){
					logger.error(JSON.stringify(err));
					resolve(null);
				}
				else
					resolve(stat.birthtime);
			});		
		})
	}

	getText(){
		const self = this;
		return new Promise((resolve, reject)=>{
			if(self.text)
				resolve(self.text);
			else{
				fs.readFile(self.path, (err, data)=>{
					if(err){
						logger.error(JSON.stringify(err));
						resolve('');
					}
					else{
						self.text = data.toString();
						resolve(self.text);
					}
				})
			}
		})
	}

	getMarkdown(){
		const self = this;
		return new Promise((resolve, reject)=>{
			if(self.mark)
				resolve(self.mark);
			else{
				self.getText().then(data=>{
					resolve(marked(data));
				})
			}
		})
	}
}

class ListMark{
	constructor(dir){
		this.dir = dir;
	}

	allMarkNote(){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				let files = yield self.allMarkFile();
				resolve(files.map(x=>{return new Note(x);}));
			})
		})
	}

	allMarkFile(){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				resolve(yield self.getMarkFunc(self.dir));
			})
		})
	}

	getMarkFunc(dir){
		const self = this;
		return new Promise((resolve, reject)=>{
			let files = [];
			co(function* () {
				let paths = yield self.getPath(dir);
				console.log('paths = ' +paths);
				let files = yield Promise.all(paths.map(x=>{
					return self.getMark(Pathfunc.join(dir, x));
				}))
				let filesarray = [];
				files.forEach(x=>{
					if(Array.isArray(x) && x.length > 0)
						filesarray.push(...x);
					else
						filesarray.push(x);
				})
				resolve(filesarray);
			})
		})
	}

	getPath(dir){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				let ret = yield toPro(dir, fs.readdir);
				console.log(ret);
				if(ret[0]){
					logger.error(JSON.stringify(ret[0]));
					resolve([]);
				}else{
					let result = [];
					for(let x of ret[1]){
						if(!/^\.\w+/.test(x)){
							result.push(x)
						}
					}
					resolve(result);
				}
			})
		})

	}

	getMark(path){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				let ret = yield isDirec(path);
				if(ret[1]){
					resolve(yield self.getMarkFunc(path));
				}
				else{
					resolve(ret[0]);
				}
			})
		})
	}
}


class MenuMark{
	constructor(dir){
		this.dir = dir;
	}

	readDir(){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				var ret = yield toPro(self.dir, fs.readdir);
				if(ret[0]){
					logger.error(JSON.stringify(ret[0]));
					resolve([]);
				}else{
					let result = [];
					let promiseArray = [];
					for(let x of ret[1]){
						if(!/^\.\w+/.test(x)){
							promiseArray.push(isDirec(Pathfunc.join(self.dir, x)))
						}
					}
					var tmpresult = yield Promise.all(promiseArray);
					tmpresult.forEach(x=>{
						if(x[1] )
							result.push(x[0]);
					});
					self.listmark = result;
					resolve(result);
				}
			})
		})
	}

	getList(){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				if(self.listmark)
					resolve(self.listmark.map(x=>{
						return new ListMark(x) ;
					}));
				else{
					resolve((yield self.readDir()).map(x=>{
						return new ListMark(x);
					}));
				}
			})
		})
	}
}

exports.Note = Note;
exports.MenuMark = MenuMark;
exports.ListMark = ListMark;
exports.checkInputPath = checkInputPath;
exports.checkOutPath = checkOutPath;