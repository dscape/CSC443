"use strict";

(function(window, $, P) {

    /* Startup code
     * ============*/
    $(function() {
        //
        // intialize formatting
        //
        initPiqunity();

        $(P.plugins).each(function(i, plugin) {
            plugin.setup();
        });

        /* a hack to avoid a dropdown-menu bug for iOS
         * https://github.com/twitter/bootstrap/issues/2975#issuecomment-6659992
         * fixed in bootstrap 2.2.2
         */
        /*
        $('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });
        */
    });

    /* Initialize
     * ========== */

    function initPiqunity(root) {
        var isRoot = (! root);
        if(isRoot) {
            root = $('body');
            P.urlParams = parse_urlParams();
            P.metadata = $('article:first').data('meta') || {};
        }
        
        // enable tooltip and popover
        $('[rel="tooltip"]', root).tooltip();
        $('[rel="popover"]', root).popover();

        // perform the embedded instructions
        $('i.instruction').each(function(i) {
            var $i = $(this);

            /* parse [to] attribute
             * the syntax is:
             *   <selector>, closest:<selector>, find:<selector>
             * ================================================= */
            var target = $i.attr('to');
            var $target;
            if(! target) {
                $target = $i.parent();
            } else {
                var split = target.indexOf(':');
                if(split >= 0) {
                    var _ = [target.substr(0, split), target.substr(split+1)];
                    if(_[0] == 'closest')
                        $target = $i.parent().closest(_[1]);
                    else if(_[0] == 'find')
                        $target = $i.parent().find(_[1]);
                    else
                        $target = $(target);
                } else {
                    $target = $(target);
                }
            }

            if($i.attr("add-class")) {
                $target.addClass($i.attr('add-class'));
            }
            if($i.attr('add-id')) {
                $target.attr('id', $i.attr('add-id'));
            }
        });

        // rendering mathematics
        // TODO
        
        // syntax highlighting, should be done in mathjax queue
        // TODO
        prettyPrint();
    }

    //
    // parse the GET parameters
    // from: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
    //
    function parse_urlParams() {
        var urlParams = {};
        var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

        while (match = search.exec(query))
            urlParams[decode(match[1])] = decode(match[2]);
        urlParams.url = window.location.pathname;

        return urlParams;
    }

})(window, jQuery, piqunity);
