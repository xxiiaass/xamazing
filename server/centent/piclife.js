"use strict";

var mongoose = require('mongoose');
var logger = require('../log/log').logger('piclife');

require('../mongo/content');
let comment = require('./comment');

var piclife = mongoose.model('Piclife');


class Piclife{
	getpiclife(cond, callback) {
		if( typeof cond == 'number' || typeof cond == 'string' ){
			if(typeof cond == 'string'){
				cond = parseInt(cond);
				if( isNaN( cond ) ){
					callback(null);
					return ;
				}
			}
			piclife.find({'id':cond}, (err ,doc) =>{
				if( err ){
					logger.error(err);
					callback(null);
				}
				else if( doc.length == 0 )
					callback(null);
				else{
					comment.getcomment(doc, comdoc=>{
						callback(comdoc);
					});
				}
			});
		}else if( typeof cond == 'object' )
			piclife.find(cond, ( err, doc) =>{
				if( err ){
					logger.error(err);
					callback(null);
				}
				else if( doc.length == 0 )
					callback(null);
				else
					comment.getcomment(doc, comdoc=>{
						callback(comdoc);
					});
			});
	}

	getcurrentpic(size, callback){
		piclife.find().sort({'_id':'-1'}).limit(size).exec((err, doc)=>{
			if( err ){
				logger.error(err);
				callback(null);
			}
			else if(doc.length == 0)
				callback(null);
			else{
				comment.getcomment(doc, comdoc=>{
					
					callback(comdoc);
				});
			}
		})
	};
}

module.exports = new Piclife();
