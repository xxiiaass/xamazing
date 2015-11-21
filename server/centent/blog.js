"use strict";

let mongoose = require('mongoose');
let logger = require('../log/log').logger('blogs');

let comment = require('./comment');

let Blogtxt = mongoose.model('Blogtxt');


let Optional = {
	'format':'normal',
};

var initoptional = function (opt) {
	let optreturn = Optional;
	for( let j in opt){
		optreturn[j] = opt[j];
	}
	return optreturn;
}

var  isArray = function(obj) {   
  return Object.prototype.toString.call(obj) === '[object Array]';    
}  

var __checktmp = function(date){
	for( let j in date){
		if( typeof date.j == 'undefined' ){
			switch(j){
				case 'id':
					date.j = 0;
					break;
				case 'title':
					date.j = '';
					break;
				case 'content':
					date.j = '';
					break;
				case 'createtime':
					date.j = new Date();
					break;
				case 'author':
					date.j = '';
					break;
				default:
					break;
			}

		}
	}	
}

var checkblog = function (date) {
	if(isArray(date))
		for(let i = 0; i< date.length; i++){
			__checktmp(date[i]);
		}
	else
		__checktmp(date);
	return date;
}

var getblog = function (cond, optional, callback) {
	if(typeof optional == 'function'){
		callback = optional;
		optional = Optional;
	}
	else
		optional = initoptional(optional);

	if( typeof cond == 'number' || typeof cond == 'string' ){
		if(typeof cond == 'string'){
			cond = parseInt(cond);
			if( isNaN( cond ) ){
				callback(null);
				return ;
			}
		}
		Blogtxt.find({'id':cond}, (err ,doc) =>{
			if( err ){
				logger.error(err);
				callback(null);
			}
			else if( doc.length == 0 )
				callback(null);
			else{
				doc = checkblog(doc);
				comment.getcomment(doc, comdoc=>{
					if(optional.format != 'markdown'){
						for(let c in comdoc){
							comdoc[c].content = comdoc[c].content.replace(/\n/g, ' ');
						}
					}
					callback(comdoc);
				});
			}
		});
	}
	else if( typeof cond == 'object' )
		Blogtxt.find(cond).sort({'_id':'-1'}).exec(( err, doc) =>{
			if( err ){
				logger.error(err);
				callback(null);
			}
			else if( doc.length == 0 )
				callback(null);
			else
				doc = checkblog(doc);
				comment.getcomment(doc, comdoc=>{
					if(optional.format != 'markdown'){
						for(let c in comdoc){
							comdoc[c].content = comdoc[c].content.replace(/\n/g, ' ');
						}
					}
					callback(comdoc);
				});
		});
}

var getcurrentblog = function (size, optional, callback){
	if(typeof optional == 'function'){
		callback = optional;
		optional = Optional;
	}
	else
		optional = initoptional(optional);

	Blogtxt.find().sort({'_id':'-1'}).limit(size).exec((err, doc)=>{
		if( err ){
			logger.error(err);
			callback(null);
		}
		else if(doc.length == 0)
			callback(null);
		else{
			doc = checkblog(doc);
			comment.getcomment(doc, comdoc=>{
				if(optional.format != 'markdown'){
					for(let c in comdoc){
						comdoc[c].content = comdoc[c].content.replace(/\n/g, ' ');
					}
				}
				callback(comdoc);
			});
		}
	})
};

class BlogClass{

	constructor(cond){
		this.cond = cond;
		return this;
	}

	save(callback){
		getcurrentblog(1, doc=>{
			doc = doc[0];
			if(doc)
				this.cond.id = Number(doc.id)+1;
			else
				this.cond.id = 10000001;
			this.cond.createtime = new Date();
			let blogtxt = new Blogtxt(this.cond);
			logger.debug(this.cond);
			blogtxt.save(err=>{
				if(err)
					logger.error('when create new blog , '+err);
				callback(err);
			});
		});
	}

	reset(oldid, newmsg){
		getblog(oldid, doc=>{
			for( let s in newmsg){
				if( s != 'comments')
					doc[s] = newmsg.s;
			}
			doc.save(function (err) {
				if(err)
					logger.error(err)
			});
		})
	}
}



exports.getblog = getblog;
exports.getcurrentblog = getcurrentblog;
exports.creatblog = function (cond) {
						return new BlogClass(cond);
					};