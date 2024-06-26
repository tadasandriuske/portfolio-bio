;
(function($) {
    mutate = {
        speed: 1,
        event_stack: mutate_event_stack,
        stack: [],
        events: {},
        add_event: function(evt) {
            mutate.events[evt.name] = evt.handler;
        },
        add: function(event_name, selector, callback, false_callback) {
            mutate.stack[mutate.stack.length] = {
                event_name: event_name,
                selector: selector,
                callback: callback,
                false_callback: false_callback
            }
        }
    };

    function reset() {
        var parent = mutate;
        if (parent.event_stack != 'undefined' && parent.event_stack.length) {
            $.each(parent.event_stack, function(j, k) {
                mutate.add_event(k);
            });
        }
        parent.event_stack = [];
        $.each(parent.stack, function(i, n) {
            $(n.selector).each(function(a, b) {
                if (parent.events[n.event_name](b) === true) {
                    if (n['callback']) n.callback(b, n);
                } else {
                    if (n['false_callback']) n.false_callback(b, n)
                }
            })
        })
        setTimeout(reset, mutate.speed);
    }
    reset();
    $.fn.extend({
        mutate: function() {
            var event_name = false,
                callback = arguments[1],
                selector = this,
                false_callback = arguments[2] ? arguments[2] : function() {};
            if (arguments[0].toLowerCase() == 'extend') {
                mutate.add_event(callback);
                return this;
            }
            $.each($.trim(arguments[0]).split(' '), function(i, n) {
                event_name = n;
                mutate.add(event_name, selector, callback, false_callback);
            });
            return this;
        }
    });
})(jQuery);