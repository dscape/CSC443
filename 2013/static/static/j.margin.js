!function(window, $, P) {

/* registration code
   ================= */

var plugin = {
    name : "margin",
    setup: function() {

        /* Margin elements
         * =============== */
        $('body').on({
            'open.piqunity': function(ev) {
                P.open(this);
                ev.stopPropagation();
            },
            'close.piqunity': function(ev) {
                P.close(this);
                ev.stopPropagation();
            },
            'toggle.piqunity': function(ev) {
                P.toggle(this);
                ev.stopPropagation();
            }
        }, '.margin,.collapse');

        /* Popups: needs to deal with body.modal-open
         * ========================================== */
        $('body').on({
            'open.piqunity': function(ev) {
                P.open(this);
                $('body').addClass('modal-open');
                ev.stopPropagation();
            },
            'close.piqunity': function(ev) {
                P.close(this);
                $('body').removeClass('modal-open');
                ev.stopPropagation();
            },
            'toggle.piqunity': function(ev) {
                P.toggle(this);
                ev.stopPropagation();
            }
        }, '.popup')
        .on('click', '.popup-middle', function(ev) {
            if(ev.target == this)
            $(this).trigger('close.piqunity');
        });

        /* Collapses
         * ========= */
        $('.collapse').on('hide', function(e) {
            $('.media', this).trigger('stop.piqunity');
        });

        /* Margin
         * ====== */
        $('.margin').each(function() {
            var $m = $(this);

            var align_target, alignment;
            if($m.attr('align') || $m.attr('align-top')) {
                align_target = $m.attr('align') || $m.attr('align-top');
                alignment = 'top';
            } else if($m.attr('align-middle')) {
                align_target = $m.attr('align-middle');
                alignment = 'middle';
            }
            var color = $m.attr('color');

            /* align the margin */
            if(align_target) {
                var $targets = $(align_target);
                var y1 = $targets.first().offset().top;
                var y2 = $targets.last().offset().top + $targets.last().height();
                var top = parseInt($m.css('top')) || 0;
                var y0 = $m.offset().top;
                var dy;
                if(alignment == 'middle') {
                    dy = (y1 + y2)/2 - y0 + top;
                } else {
                    dy = y1 - y0 + top;
                }
                $m.css('top', top + dy);

                if($m.attr('snap')) {
                    var $snap = $targets.first();
                    var x1 = $m.offset().left;
                    var x2 = $snap.offset().left + $snap.outerWidth() + 10;
                    $m.css({left: x2 - x1});
                }


                if(color) {
                    $targets.css('background', color);
                }

                P.pairup($targets, $m);
                P.pairup($('.margin-anchor', $m), $targets);

                $m.on('opened', function() {
                    P.macro.flash($targets, 800);
                });
            }

        });
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);

function snapMargins(o) {
    o = $.extend({once: false}, o);
    $('.margin').each(function(i) {
        var $m = $(this);


        var annotate = $m.attr('annotate');
        if(annotate) {
            var target = annotate.split(/\s+/);
            if(target.length > 1) {
                var program = target[0];
                var block = target[1];
                var selector = sprintf("%s .%s", program, block);

                var y1 = $(selector + ":first").offset().top;
                var $last = $(selector + ":last");
                var y2 = $last.offset().top + $last.height();
                var top = parseInt($m.css('top')) || 0;
                var y0 = $m.offset().top;
                var dy = (y2+y1)/2 - y0;
                $m.css('top', top + dy);
                $m.attr('snap', program);
            }
        }

        if($m.attr('align')) {
            var $align = $($m.attr('align'));
            if($align.size()) {
                var y1 = $m.offset().top,
                    y2 = $align.offset().top;
                $m.css({top: y2-y1+10});
            }
        }

        if($m.attr('snap')) {
            var $snap = $($m.attr('snap'));
            if($snap.size()) {
                var x1 = $m.offset().left;
                var x2 = $snap.offset().left + $snap.outerWidth() + 10;
                $m.css({left: x2 - x1});
            }
        }

    });

    if(! o.once) {
        setTimeout(function() {
            snapMargins();
        }, 2000);
    }
}

}(window, jQuery, window.piqunity);
