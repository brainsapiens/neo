if (enable.jQueryUI.selectmenu === true) {
    const $selectmenu = $('.js-selectmenu-select');

    $selectmenu.selectmenu({
        create: function (event) {
            const $select = $(event.target);
            const $button = $(event.target.nextSibling);

            $('#' + event.target.id + '-menu').css('max-width', $button.outerWidth());

            if (
                $select
                    .find('option:first-child')
                    .is(':disabled')
            ) {
                $select
                    .next('.ui-selectmenu-button')
                    .find('.ui-selectmenu-text')
                    .addClass('ui-state-placeholder');
            }
        }
    });

    $(window).on('optimizedResize', function () {
        $selectmenu.selectmenu('close');
    });
}
