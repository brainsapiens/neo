// Create mq
const mq = {};

function createMq(array) {
    const mqDevice = enable.mqDevice ? 'device-' : '';

    array.forEach(function (element, index) {
        const mqRange = index === 0 ? 'max' : 'min';

        mq[element[0]] = {
            int: element[1],
            str: '(' + mqRange + '-' + mqDevice + 'width: ' + element[1] + 'px)'
        };
    });
}

if (enable.mq) {
    createMq(mqBreakpoints);
}

// Interact multiple
const interactMultiple = function (selector, hoverClass, activeClass) {
    if (!Modernizr.touchevents) {
        $(document)
            .on('mouseenter mouseleave', selector, function (e) {
                $(selector)
                    .filter('[href="' + $(this).attr('href') + '"]')
                    .toggleClass(hoverClass, e.type === 'mouseenter');
            })
            .on('mousedown mouseup', selector, function (e) {
                $(selector)
                    .filter('[href="' + $(this).attr('href') + '"]')
                    .toggleClass(activeClass, e.type === 'mousedown');
            });
    }
};

if (enable.interactMultiple) {
    interactMultiple('.js-hover', 'hover', 'active');
}

// Debounced Resize() jQuery Plugin
// https://www.paulirish.com/2009/throttled-smartresize-jquery-event-handler/
(function ($, sr) {
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this;
            var args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');
