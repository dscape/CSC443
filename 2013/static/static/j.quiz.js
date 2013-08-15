!function(window, $, P) {

"use strict";

/* registration code
   ================= */

var plugin = {
    name : "QUIZ",
    setup: function() {
        $('body').on('click', '.check-quiz', function(e) {
            /* check the quiz
             * ============== */
            var $quiz = $(this).closest('.quiz');

            /* for each choice, check if it's correct
             * ====================================== */
            $('.choice', $quiz).each(function(i) {
                var $choice = $(this);
                $choice.removeClass('correct incorrect');
                var rightAnswer = $choice.attr('yes') ? true : false;
                var answer = $(':checkbox', $choice).is(":checked");
                if(rightAnswer == answer)
                    $choice.addClass('correct');
                else
                    $choice.addClass('incorrect');
            });

            /* if there is an incorrect choice, the quiz is incorrect
             * ====================================================== */

            $quiz.removeClass('correct incorrect');
            if($('.choice.incorrect', $quiz).size() > 0) {
                $quiz.addClass('incorrect');
            } else {
                $quiz.addClass('correct');
            }
        }).on('click', '.choice', function(e) {
            e.stopPropagation();
            if($(e.srcElement).is(":checkbox"))
                return;
            else {
                var $choice = $(this).closest('.choice');
                /* toggle the checkbox inside 
                 * ========================== */
                var $checkbox = $(':checkbox', $choice);
                $checkbox.prop('checked', !$checkbox.is(":checked"))
            }
        });
    }
};

if(! P.plugins) P.plugins = [];
P.plugins.push(plugin);


}(window, jQuery, window.piqunity);