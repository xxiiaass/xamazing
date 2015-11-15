"use strict";

let mongoose = require('mongoose');
let logger = require('../log/log').logger('blogs');

let comment = require('./comment');

let Blogtxt = mongoose.model('Blogtxt');

class Blog{
	getblog(cond, callback) {
		if( typeof cond == 'number' )
			Blogtxt.find({'id':cond}, (err ,doc) =>{
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
		else if( typeof cond == 'object' )
			Blogtxt.find(cond, ( err, doc) =>{
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

	getcurrentblog(size, callback){

		Blogtxt.find().sort({'_id':'-1'}).limit(size).exec((err, doc)=>{
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



module.exports = new Blog();