if (enable.components.wysiwyg === true) {
    const $wysiwyg = $('.js-wysiwyg');

    // Img
    $wysiwyg
        .find('img')
        .each(function () {
            $(this).removeAttr('width height');
        });

    $wysiwyg
        .find('> p > img')
        .each(function () {
            $(this).unwrap();
        });

    // Table
    $wysiwyg
        .find('> table')
        .each(function () {
            $(this).wrap('<div class="wysiwyg__table"/>');
        });

    // Video (Youtube, Vimeo)
    $wysiwyg
        .find('> iframe[src*="vimeo"], > iframe[src*="youtube"]')
        .each(function () {
            $(this).wrap('<div class="wysiwyg__video"/>');
        });
}

