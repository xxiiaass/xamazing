'use strict';

var Base = require('./base')
var marked = require('marked');
const config = require('../../config');

class Blog{
	constructor(doc){
		if(doc._id){
			this.mongoDate = doc;
		}
		this.id = doc.id;
		this.title = doc.title;
		this.content = doc.content;
		this.createtime = doc.createtime;
		this.author = doc.author;
	}

	idfunc(){
		return this.id;
	}

	titlefunc(newtitle){
		if(newtitle)
			this.title = newtitle;
		else
			return this.title;
	}

	contentMark(){
		return marked(this.content);
	}

	linktoGithubContent(){
		//var bigpic = this.content.replace(/(!\[.+\]\()(.*?\))/g, '$1https://cdn.rawgit.com/xxiiaass/MYCDN/'+ config.CNDpicbranch +'/public$2'); //不需要链接到github上，所以注释掉
		//return marked(bigpic.replace(/\/(?=[^\/]+?\))/g, '/min/'));

		return marked(this.content.replace(/\/(?=[^\/]+?\))/g, '/min/'));
	}
	contentfunc(newcontent){
		if(newcontent)
			this.content = newcontent;
		else{
			return this.content;
		}
	}

	createtimefunc(newcreatetime){
		if(newcreatetime)
			this.createtime = newcreatetime;
		else 
			return this.createtime;
	}

	authorfunc(newauthor){
		if(newauthor)
			this.author = newauthor;
		else
			return this.author;
	}

	save(){
		if(this.mongoDate){
			this.mongoDate.id = this.id;
			this.mongoDate.title = this.title;
			this.mongoDate.content = this.content;
			this.mongoDate.author = this.author;
			this.mongoDate.createtime = this.createtime;
			this.mongoDate.save();
			return ;
		}else{
			let con = {};
			con.id = this.id;
			con.title = this.title;
			con.content = this.content;
			con.author = this.author;
			con.createtime = this.createtime;
			Base.add('blog', con);
		}
	}
}

Blog.getCurrent = Base.getCurrentFunc('blog', Blog);
Blog.getRang = Base.getRangFunc('blog', Blog);
Blog.search = Base.searchFunc('blog', Blog);
Blog.getById = Base.getByIdFunc('blog', Blog);

module.exports = Blog;
