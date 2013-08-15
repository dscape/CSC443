!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "SCROLLSPY",
    setup: function() {
    	if($('#main-navbar').size()) {
    		var sections = $('article > section');
    		var topOffset = $('#main-navbar').height() + 10;

    		$(window).scroll(function(ev) {
    			onScrolling(sections, topOffset);
    		});
    	}
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);

function onScrolling(sections, topOffset) {
	var focusedSection = P.focusedSection(sections, topOffset);

	if(focusedSection) {
		var $h1 = $("h1:first", focusedSection);
		$('#navbar-scrollspy').text($h1.text());
        $('.current').removeClass('current');
		$(focusedSection).addClass('current');
	}
}

P.focusedSection = function(sections, topOffset) {
    if(!sections) {
        sections = $('article > section');
    }
    if(topOffset == null)
        topOffset = $('#main-navbar').height() + 10;

    var focusOffset = $('body').scrollTop() + topOffset;
    var focusedSection = null;

    // See which section overlaps with the focusOffset
    sections.each(function(i) {
        var top = $(this).offset().top;
        var bot = top + $(this).outerHeight(true); // includes margin
        if(top < focusOffset && focusOffset <= bot ) {
            focusedSection = $(this);
            return false;
        }
    });

    return focusedSection;
}

}(window, jQuery, window.piqunity);
