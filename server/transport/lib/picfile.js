'use strict';

var path = require('path');
var fs = require('fs');
var co = require('co');
var FileWorker = require('./filework');
var logger = require('log4js').getLogger("picfile");
const assert = require('assert');
const config = require('../../../config');
const exec = require('child_process').exec;

var fileTools = require('../../safe/fileTools');

const size = "500x>";
const minsize = "500x300";
//const movetodir = path.join(__dirname, '../../../client/images/pushimg');
//const mindir = path.join(__dirname, '../../../client/images/pushimg/min');

const movetodir = path.join(config.CDNpath,  'public/images/pushimg');
const mindir = path.join(config.CDNpath, '/public/images/pushimg/min');

fileTools.sureExistsSync(movetodir);
fileTools.sureExistsSync(mindir);

var toPro = function(...argus) {
    return new Promise(function(resolve, reject) {
        var func = argus.pop();
        argus.push(function() {
            resolve(Array.from(arguments));
        });
        func.apply(this, argus);
    });
}

class PicFile extends FileWorker{
	constructor(fromidFiles){
		super(fromidFiles);
	}

	deal(){
		var self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				logger.info(self.oldAddr.name +' picfile begin deal');
				yield self.moveTo(movetodir);
				self.url = self.newAddr.path.replace(/^.*\/images\//, '/images/');
				yield self.compress();
				self.fileReady();
				resolve(true);
			});
		})
	}

	compress(){
		var self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				assert(self.newAddr, 'newAddr is null');
				var compressShell = `convert ${self.newAddr.path} -resize '${size}' -gravity center -crop ${minsize}+0+0 +repage ${self.newAddr.path.replace(/\/(?=[^\/]+$)/, '/min/')}`;
				var std = yield toPro(compressShell, exec); 
				if(std[0] || std[1])
					logger.error('compress:'+error+stderr);
				resolve(true);
			})
		})
	}

	fileReady(){
		assert(this.newAddr, 'newAddr is null');
		const self = this;
		self.callback = function () {
			self.emit('comepic', self);
			logger.debug(this.oldAddr.name +' emited');
		}
		self.on('comeblog',self.callback);
		self.callback();
	}

	fileComplete(){
		this.removeListener('comeblog',this.callback);
	}
}

module.exports = PicFile;