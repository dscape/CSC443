!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "EMPTY",
    setup: function() {
        var $navbar_addons = $('.navbar-addon');
        $navbar_addons
            .addClass('nav')
            .detach();
        $('#main-navbar').after($navbar_addons);
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


}(window, jQuery, window.piqunity);