define(function(require, exports, module) {
	require('bootstrap');
//	require('less');
	var $ = require('jquery');


	$(document).ready(function () {
        $('.portfolio-link img').on("click", function () {
                var src = $(this).attr('src');
              // var len = src.lastIndexOf('-');
                //var tmpsrc = src.substr(0, len);
                $('#portfolioModal1 img').attr('src', src	);
        })
    })
});