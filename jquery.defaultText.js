/*
 * Default text - jQuery plugin for setting default text on inputs
 *
 * Author: Weixi Yen
 *
 * Email: [Firstname][Lastname]@gmail.com
 * 
 * Copyright (c) 2010 Resopollution
 * 
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.github.com/weixiyen/jquery-defaultText
 *
 * Version:  0.0.1
 *
 * Features:
 *      Auto-clears default text on form submit, then resets default text after submission.
 *      Allows context definition for better performance (uses event delegation)
 *      Allow user to set events to auto-clear fields.
 *          - defaultText automatically resets after event is run.  No need to manually re-populate default text.
 *      
 * Usage (MUST READ):
 *      
 *      <input type="text" title="enter your username" />   // the title field is mandatory for this to work
 *
 *      $.defaultText()                                     // input will show "enter your username" by default
 *                                                          // and have a css class of 'default'
 *                                                          // form fields with default text automatically clear when submitting form
 *
 *      $.defaultText({
 *          context:'form',                                 // only inputs inside of 'form' will be set with defaultText
 *          css:'myclass',                                  // class of input when default text is showing, default class is 'default'
 *          clearEvents:[
 *              {selector: '#button2', type:'click'},       // when button2 is clicked, inputs with default text will clear
 *              {selector: '#link3', type:'click'}          // this is useful for clearing inputs on ajax calls
 *          ]                                               // otherwise, you'll send default text to the server
 *      });
 *
 */
(function($){
    $.defaultText = function(opts) {
        var selector = 'input:text[title]',
            ctx = opts && opts.context ? opts.context : document,
            css = opts && opts.css ? opts.css : 'default',
            form_clear = [{selector: 'form', type:'submit'}];
            clear_events = opts && opts.clearEvents ? form_clear.concat(opts.clearEvents) : form_clear;
        
        $(ctx).delegate(selector, 'focusin', function(e){
            e.stopPropagation();
            onFocus($(this));
        }).delegate(selector, 'focusout', function(e){
            e.stopPropagation();
            var ele = $(this),
                title = ele.attr('title'),
                val = ele.val();
            if ($.trim(val) === '' || val === title) ele.val(title).addClass(css); 
        });
        
        $(selector).trigger('focusout');
        
        $.each(clear_events, function(i, event){
            $(event.selector).bind(event.type, function(){
                $(selector, this).each(function(){
                    onFocus($(this));
                });
                setTimeout(function(){
                    $(selector).trigger('focusout'); 
                }, 1);
            });
        });
        
        function onFocus(ele) {
            var title = ele.attr('title'),
                val = ele.val();
            ele.removeClass(css);
            if (title === val) ele.val('');
        }
    }
})(jQuery);