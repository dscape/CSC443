!function(window, $, P) {

/* registration code
   ================= */

var plugin = {
    name : "actions",
    setup: function() {
        $('body').on('click', '[click]', function(e) {
            e.preventDefault();
            var action = $(this).attr('click');
            P.runmacro(this, action);
        });

        /* cannot cancel the events as they are needed by bootstrap
         * ======================================================== */
        $('body').on('show', '[onshow]', function(e) {
            P.runmacro(this, $(this).attr('onshow'));
        });

        $('body').on('hide', '[onhide]', function(e) {
            P.runmacro(this, $(this).attr('onhide'));
        });
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


/* ===========================================================
 * The mini macro system
 * =========================================================== */

/* Highlight lines in a program
 * ============================ */

function program_highlight(prog, start, end, color) {
    var $prog = $(prog);
    var s = parseInt(start), t = parseInt(end);
    if(! color) {
        color = '#ff0';
    }
    var $ol = $('ol:first', $prog);
    console.debug($ol, prog, start, end, color);
    $ol.children().each(function(i) {
        if(s <= (i+1) && (i+1) <= t) {
            $(this).css('background-color', color);
        }
    });
}

/* The macro system
 * ================ */

P.runmacro = function(context, action_str) {

    /* simple inline action definition:
     * <macro> arguments...
     * ================================ */
    var action_list = action_str.split(/\s+/);
    var macro_name = action_list.shift();

    var f = P.macro[macro_name] || window[macro_name];

    if(f) {
        console.log(sprintf('runmacro: [%s]:', macro_name), action_list);
        f.apply(context, action_list);
    } else {
        $.error(sprintf('runmacro: [%s] does not exist.', macro_name));
    }
};

// P.execute = function(el, action) {
//     action = action.slice(); // make a copy of action
//     var name = action.shift();

//     /* global function is defined, use it
//      * ================================== */
//     if(window[name]) {
//         console.debug('fun execute', name, action);
//         return window[name].apply(el, action);
//     } 
//      try to use macro
//      * ================ 
//     else if(P.macro[name]) {
//         var selector = action.shift();
//         console.debug('macro execute', name, selector, action);
//         if((! selector) || (selector == 'this')) selector = el;
//         return P.macro[name].apply($(selector), action);
//     } else {
//         $.error(sprintf('MACRO/FUNCTION "%s" DOES NOT EXIST IN ACTION %s', name, action));
//     }
// }

P.macro = {};

P.macro.addclass    = function(selector, classname) { $(selector).addClass(classname);    };

P.macro.removeclass = function(selector, classname) { $(selector).removeClass(classname); };

P.macro.toggleclass = function(selector, classname) { $(selector).toggleClass(classname); };

P.macro.css         = function(selector, css)       { $(selector).css(css);               };

P.macro.animate     = function(selector, css, t)    { $(selector).animate(css, t);        };

P.macro.scrollto    = function(selector, speed)     { P.scrollto(selector, speed);        }

P.macro.scrollmiddle = function(selector) {
    P.scrollmiddle($(selector));
};

P.macro.toggle = function(selector) { P.toggle(selector); }
P.macro.open   = function(selector) { P.open(selector); }
P.macro.close  = function(selector) { P.close(selector); }

P.macro.highlight   = function(selector) {
    var args = [].slice.call(arguments);

    var $el = $(selector);
    if($el.is('.program')) {
        program_highlight.apply(this, args);
    } else {
        $el.css('background', '#ffe');
    }
};

P.macro.unhighlight = function(selector) {
    var args = [].slice.call(arguments);
    args.push('transparent');
    var $el = $(selector);
    if($el.is('.program')) {
        program_highlight.apply(this, args);
    } else {
        $el.css('background', 'transparent');
    }
}

P.macro.flash = function(selector, duration) {
    var t = duration || 400;
    var $el = $(selector);
    $el.fadeOut(50, function() {
        $el.fadeIn(t-50);
    });
}

P.macro.trigger = function(evtype) {
    var args = [].slice.call(arguments);
    args.shift();
    $(this).trigger(evtype, args);
};

}(window, jQuery, window.piqunity);
