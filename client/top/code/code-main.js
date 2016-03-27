define(function(require, exports, module) {
    require('bootstrap');
    var $ = require('jquery');
    var header = require('header');

    var menus = [];
    var lists = [];

    var textPlaceClean = function () {
    	$('.marktext').empty();
    }

    function List(path){
    	var self = this;
    	this.path = path;
    	this.basename = path.match(/([^\/]+)\.\w+$/)[1];
    	$('.marklist .row').append('<div class="marktag col-sm-4 col-xs-6"><span>'+this.basename+'</span></div>');
    	this.ele = $('.marklist .row').children().last().children();
    	this.ele.on('click', function () {
    		self.click();
    	});
    }

    List.prototype.light = function() {
    	$('.marktag span.active').removeClass('active');
    	this.ele.addClass('active');
    };

    List.prototype.click = function() {
    	this.light();
    	textPlaceClean();
    	header.loadingShow();
    	var path = this.path;
    	$.ajax({
            'url': '/code/getfiletext',
            'type': 'get',
            'data': {
                "filepath": path,
            },
            'success': function(data) {
            	header.loadingHide();
            	$('.marktext').append(data);
            }
        });

    };

    List.prototype.clean = function(){
    	this.ele.parent().remove();
    }

   function Menu(ele) {
   		var self = this;
    	this.ele = ele;
    	this.id = ele.attr('id');
    	ele.on('click', function () {
    		self.click();
    	});
    }

    Menu.prototype.light = function () {
    	$('.menu.active').removeClass('active');
    	this.ele.addClass('active');
    }

    Menu.prototype.click = function() {
    	this.light();
    	textPlaceClean();
    	header.loadingShow();
        $.ajax({
            'url': '/code/getlist',
            'type': 'get',
            'data': {
                "listname": this.id.replace(/-/g, '/'),
            },
            'success': function(data) {
            	header.loadingHide();
            	lists.forEach(function(x){
            		x.clean();
            	});
            	lists = [];
            	data.forEach(function(x){
            		lists.push(new List(x));
            	});
            }
        });
    };

    $('.menu').each(function () {
    	menus.push(new Menu($(this)));
    })

    $(document).ready(function () {
    	menus[0].click();
    })
});
