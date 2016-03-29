'use strict';

var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var co = require('co');
var unam = require('./lib/parsefile');
var PicFile = require('./lib/picfile');
var BlogFile = require('./lib/blogfile');
var logger = require('log4js').getLogger("transport");
var fileTools = require('../safe/fileTools');

/*
 * 这个目录用于临时存放上传的文件
 * 当文件后续处理及校验失败时，文件会滞留在这个文件夹
*/
const tmpdir = path.join(__dirname, './tmpfiles'); 
fileTools.sureExistsSync(tmpdir);

var toPro = function(...argus) {
    return new Promise(function(resolve, reject) {
        var func = argus.pop();
        argus.push(function() {
            resolve(Array.from(arguments));
        });
        func.apply(this, argus);
    });
}

/*
 * 用于接受上传文件，根据文件后缀名，生成特定的类，进行文件的处理工作
 * 文件后缀名是穷举的，需要手动添加新类型
 *
 * 参数为express中的req对象
 */

var recvfile = function(req){
    return new Promise((resolve, reject)=>{
        co(function* () {
            var form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            form.maxFieldsSize = 2 * 1024 * 1024;
            
            form.uploadDir = tmpdir;
            form.parse(req, (err, fields, files)=>{
                if (err)
                    reject(err);
                var extname = path.extname(files.upload.path);
                switch (extname.toLowerCase()) {
                    case '.png':
                    case '.jpg':
                        var picfile = new PicFile(files);
                        logger.debug(picfile);
                        resolve(picfile.deal());
                        break;
                    case '.amblog':
                    case '.ampic':
                        var blogfile = new BlogFile(files);
                        resolve(blogfile.deal());
                        break;
                    default:
                        reject('file type err');
                        break;
                }
            });
        });      
    });
}

exports.recvfile = recvfile;