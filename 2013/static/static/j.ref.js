/*
 * create hover effect for
 * <a.reference> elements
 */

!function(window, $, P) {

/* registration code
   ================= */

var plugin = {
    name : "ref",
    setup: function() {

        $('a.ref').each(function(i) {
            var name = $(this).attr('name');
            var citation = $(sprintf('.citation[name="%s"]', name));
            var html = citation.html();
            html = html + sprintf(
                '&nbsp;<a class="lsf" click="scrollto [name=%s]" style="font-size: 100%%;">next</a>',
                name);
            $(this).popover({
                animation: true,
                html: true,
                title: 'Reference',
                placement: 'top',
                trigger: 'click', // 'hover',
                content: html,
                delay: {show: 0, hide: 400}
            });
            var link = $
        });
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


}(window, jQuery, window.piqunity);
