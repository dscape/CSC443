!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "READING",
    setup: function() {
        var all_cls = 'in-reading in-lecture';

        /* allow switching reading modes
         * ============================= */

        $('a.choose-reading-mode').each(function(i) {
            var $a = $(this);
            var cls = 'in-' + $a.attr('mode');
            $a.on('click', function(e) {
                $('body').removeClass(all_cls).addClass(cls);
                $('#navbar-reading-mode').text($(this).attr('mode').toUpperCase());
                e.preventDefault();
            });
        });

        // setup initial reading mode
        var init_mode = P.metadata['mode'];
        if(init_mode) {
            $(sprintf('a.choose-reading-mode[mode=%s]', init_mode)).click();
        } else {
            $('a.choose-reading-mode:first').click()
        }
        
        // setup the navigation key bindings
        $('body').on({
            'click-nav': function(e) {
                /******************
                 *                *
                 ******************/
                step_in_page(e.direction);
            },
            'dblclick-nav': function(e) {
                /******************
                 *                *
                 ******************/
                turn_page(e.direction);
            }
        });

        //
        // Setup the pages
        //
        $('article > section').addClass('page');

    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);

function turn_page(direction) {
    var $sec = P.focusedSection();
    var $next;
    if(direction == 'up') {
        $next = $sec.prev('.page');
    } else {
        $next = $sec.next('.page');
    }
    if($next.size()) {
        // reset page
        $next.removeData('laststep');
        var lecture = $sec.data('lecture');
        if(lecture && lecture.init)
            $(lecture.init).each(function() {
                P.runmacro($next[0], this);
            });
        // goto page
        P.scrollto($next);
    }
}

function step_in_page(direction) {
    var $sec = P.focusedSection();
    var delta = (direction == 'up') ? -1 : 1;
    if($sec) {
        var lecture = $sec.data('lecture');
        if(lecture) {
            var i = $sec.data('laststep');
            i = (i == null) ? 0 : (i+delta);

            if(lecture.steps && i < lecture.steps.length) {
                var action = lecture.steps[i];
                P.runmacro($sec[0], action);
                $sec.data('laststep', i);
            }
        }
    }
}

}(window, jQuery, window.piqunity);
