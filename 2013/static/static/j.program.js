!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "PROGRAM",
    setup: function() {

        // define the blocks

        $('.program').each(function() {
            var blocks = $(this).data('blocks');
            for(var name in blocks) {
                var block = blocks[name];
                var i = block.start;
                var j = block.end || block.start;
                $('li', this).each(function(k) {
                    if(i<= k && k <= j)
                        $(this).addClass(name);
                    if(k > j) return false;
                });
            }
        });
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


}(window, jQuery, window.piqunity);