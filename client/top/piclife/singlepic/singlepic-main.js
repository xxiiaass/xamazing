define(function(require, exports, module) {
	require('bootstrap');
    var header = require('header');
    var $ = require('jquery');

    $('.portfolio-modal, .modal-dialog').on('click',function () {
        header.loadingHide();
    })

    $(document).ready(function () {
        $('.portfolio-link img').on("click", function () {
        	header.loadingShow();
        	$('#portfolioModal1 img').attr('src', '');
        	$('#portfolioModal1 img').load(function  () {
        		header.loadingHide();
        	})
            $('#portfolioModal1 img').attr('src', $(this).attr('src').replace(/\/min\//, '/'));
        });
    });
});