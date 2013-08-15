!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "MEDIA",
    setup: function() {

        /* Setup the Popcorn players
         * ========================= */

        $('.media').each(function(i) {
            var audio_element = this;
            var id = '#' + $(this).attr('id');
            var popcorn = Popcorn(id);
            $(this).data('popcorn', popcorn);

            /* stop others if this is playing
             * ============================== */

            popcorn.on('play', function() {
                stopAllMedia(audio_element);
            });

            var control = $(this).data('control');
            if(control) {
                $(control).each(function(i) {
                    var cue = this;
                    var f = function() {
                        P.runmacro(audio_element, cue.do);
                    };
                    switch(cue.at) {
                        case 'play':
                            popcorn.on('play', f);
                            break;
                        case 'pause':
                            popcorn.on('pause', f);
                            break;
                        default:
                            popcorn.cue(cue.at, f);
                    }
                });
            }
        });

    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


function stopAllMedia(except) {
    var except_uid = except ? $(except).attr('sysuid') : null;
    $('.media').each(function() {
        var uid = $(this).attr('sysuid');
        if(uid != except_uid) {
            $(this).data('popcorn').pause();
        }
    });
}

}(window, jQuery, window.piqunity);