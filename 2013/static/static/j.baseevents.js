!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "BASE_EVENTS",
    setup: function() {

		$('body').on('ping', '*', function(e) {
            e.stopPropagation();
            e.preventDefault();

            $(this).toggleClass('pinged');
            if($(this).is('.pinged'))
                $(this).css('color', 'red');
            else
                $(this).css('color', '');

		});

    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


}(window, jQuery, window.piqunity);
