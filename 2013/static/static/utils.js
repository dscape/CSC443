(function(window, $, P) {


    P.scrollto = function(el, speed, body) {
        var top, d, t;
        var $body = (body) ? $(body) : $('body,html');

        if($.isNumeric(el)) {
            top = el,
            d = Math.abs(top - $('body').scrollTop());
        } else {
            var $el = $(el);
            top = $el.offset().top - $('.content').offset().top;
            d = Math.abs(top - $('body').scrollTop())
        }
        if(speed == 0) speed = 1000;
        speed = speed || 0.8; // pixel per millisecond
        
        if(speed == 'now')
            t = 0;
        else
            t = Math.min(800, d / speed);

        var dfd = $.Deferred();
        $body.stop().animate({
            scrollTop: top
        }, {
            duration: t,
            complete: function() {
                dfd.resolve();
            }
        });
        return dfd.then($('body').trigger('scrolled', [el]));
    };

    P.scrollmiddle = function(el) {
        var $el = $(el);

        // screen pixel
        var dh = $('.navbar:first').height(),
            h0 = $(window).height() - dh;

        // document pixel
        var y1 = $el.offset().top,
            h1 = $el.height(),
            y = y1 - (h0 - h1)/2 - dh;

        return P.scrollto(y);
    };

    P.scrollbottom = function(el) {
        var $el = $(el);
        var dh = 50,
            h0 = $(window).height();
        var y1 = $el.offset().top,
            h1 = $el.height(),
            y = y1 + h1 + dh - h0;

        return P.scrollto(y);
    }


    P.scrollHorizontal = function(el) {
        var left = el ? $(el).offset().left : 0;
        $('body,html').animate({
            scrollLeft: left
        }, {
            duration: 400
        });
    };

    P.isInScreen = function(el) {
        var $el = el,
            dh1 = $('.navbar:first').height(),
            dh2 = 50,
            y0 = $('body').scrollTop(),
            h0 = $(window).height(),
            y1 = y0 + dh1,
            y2 = y0 + h0 - dh2;

        var ey1 = $el.offset().top,
            ey2 = ey1 + $el.height();

        return (ey1 >= y1 && ey2 <= y2);
    }

    P.isSmallScreen = function() {
        var w = $(window).width();
        return (w < 980);
    }

    P.open = function(el) {
        var $this = $(el);

        /* Close the others if this is part of a group
         * =========================================== */
        if($this.attr('group')) {
            $(sprintf('[group=%s]', $this.attr('group'))).each(function() {
                if($(this).attr('sysuid') == $this.attr('sysuid'))
                    return true;
                else
                    P.close(this);
            });
        }
        
        $this.removeClass('closed');
        if($this.is('.collapse')) $this.collapse('show');
        else
            $this.trigger('opened');
    };
    
    P.close = function(el) {
        var $this = $(el);
        $this.addClass('closed');
        if($this.is('.collapse')) $this.collapse('hide');
        else
            $this.trigger('closed');
        $('.media', $this).trigger('stop.piqunity');
    };

    P.toggle = function(el) {
        var $this = $(el);
        if($this.is('.collapse'))
            ($this.is('.in')) ? P.close(el) : P.open(el);
        else
            if($this.is('.closed'))
                P.open(el);
            else
                P.close(el);
    }

    P.pairup = function(flasher, flashed) {
        var $el1 = $(flasher), $el2 = $(flashed);
        $el1.on({
            'mouseenter': function(e) {
                P.macro.flash($el2);
            }
        });
    }


})(window, jQuery, piqunity);
