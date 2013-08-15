!function(window, $, P) {

"use strict";

var INIT = 0,
    DOWN = 1,
    HOLDING = 2;

/* tuning parameters */
var T_HOLD = 200,
    T_DBLCLICK = 280;

/* keys */
var KEYUP = 33, // PGUP
    KEYDOWN = 34; // PGDOWN

function Recognizer(category, upKey, downKey, target) {
    this.s = INIT;
    this.timer = null;
    this.t0 = null;
    this.lastUp = null;
    this.target = target;
    this.category = category;
    this.upKey = upKey;
    this.downKey = downKey;
}
Recognizer.prototype.down = function(e) {
    var s0 = this.s;
    console.debug('down', e, this);
    this.clearTimeout();
    switch(this.s) {
    case INIT:
        /* transition to DOWN and record the time
         * ====================================== */
        this.s = DOWN;
        this.t0 = e.timeStamp;
        break;
    case DOWN:
    case HOLDING:
        /* repeated down emit hold(t)
         * ========================== */
        var t = e.timeStamp;
        if(t - this.t0 > T_HOLD) {
            this.s = HOLDING;
            this.emit('hold', e, t-this.t0);
        }
        break;
    }
    console.debug(sprintf('down[%s] %s => %s', e.which, s0, this.s));
};

Recognizer.prototype.up = function(e) {
    var s0 = this.s;
    this.clearTimeout();
    var dt = this.lastUp ? (e.timeStamp - this.lastUp) : 0;
    /* if UP's are spaced apart, delay fire click
     * ========================================== */
    if(this.lastUp == null || dt > T_DBLCLICK) {
        if(this.s == HOLDING) {
            this.emit('endhold', e, dt);
        } else {
            var self = this;
            this.timer = setTimeout(function() {
                self.emit('click', e, dt);
            }, T_DBLCLICK);
        }
    } else {
        this.emit('dblclick', e, dt);
    }
    this.s = INIT;
    this.lastUp = e.timeStamp;
    console.debug(sprintf('up[%s] %s => %s', e.which, s0, this.s));
};

Recognizer.prototype.clearTimeout = function() {
    if(this.timer) clearTimeout(this.timer);
    this.timer = null;
    return this;
};
Recognizer.prototype.emit = function(event, e, t) {
    var e = $.Event(event + '-' + this.category, {
        direction: (e.which == this.upKey) ? 'up' : 'down',
        up: (e.which == this.upKey),
        down: (e.which == this.downKey),
        t: t
    });
    console.debug('emitting:', this.target, e);
    $(this.target).trigger(e);
    return this;
};

var r = new Recognizer('nav', KEYUP, KEYDOWN, 'body');

/* registration code
   ================= */

var plugin = {
    name : "RECOGNIZER",
    setup: function() {
        $('body').on({
            'keydown': function(e) {
                if(! $("body").is(".in-lecture")) return true;
                switch(e.which) {
                    case KEYUP:
                    case KEYDOWN:
                        console.debug('r.down', e.which);
                        e.preventDefault();
                        return r.down(e);
                }
            },
            'keyup': function(e) {
                if(! $("body").is(".in-lecture")) return true;
                switch(e.which) {
                    case KEYUP:
                    case KEYDOWN:
                        e.preventDefault();
                        return r.up(e);
                }
            }
        });
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


}(window, jQuery, window.piqunity);
