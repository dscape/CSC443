!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "CAROUSEL",
    setup: function() {

    	$('.carousel').carousel({
    		interval: false
    	});

    	$('body').on('click', '.carousel .carousel-control', function(e) {
    		e.preventDefault();
    		e.stopPropagation();

    		var $carousel = $(this).closest('.carousel');
    		var $active = $('.item.active', $carousel);
    		var $control = $(this);
    		
    		if($control.is('.left'))
	    		if($active.prev().size() == 0)
	    			return;
	    		else
	    			$carousel.carousel('prev');
	    	
	    	if($control.is('.right'))
	    		if($active.next().size() == 0)
    				return;
    			else
    				$carousel.carousel('next');
    	});

    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


}(window, jQuery, window.piqunity);