// Viewport
if (enable.mqDevice) {
    const viewport = document.querySelector('meta[name="viewport"]');

    if (screen.width >= mqBreakpoints[0][1]) {
        viewport.setAttribute('content', 'width=' + viewportWidth);
    }
}

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

// Optimized resize
// https://developer.mozilla.org/ru/docs/Web/Events/resize
(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    throttle('resize', 'optimizedResize');
})();
