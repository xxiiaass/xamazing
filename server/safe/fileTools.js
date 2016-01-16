
var fs = require('fs');

var sureExistsSync = function(dir){
	if(!fs.existsSync(dir)){
	    if( fs.mkdirSync(dir) )
			throw(new Error(`mkdir dir ${dir} err!`));
	}
}


exports.sureExistsSync = sureExistsSync;