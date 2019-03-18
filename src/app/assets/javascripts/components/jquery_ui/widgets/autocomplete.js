if (enable.jQueryUI.autocomplete === true) {
    const availableTags = [
        'ActionScript',
        'AppleScript',
        'Asp',
        'BASIC',
        'C',
        'C++',
        'Clojure',
        'COBOL',
        'ColdFusion',
        'Erlang',
        'Fortran',
        'Groovy',
        'Haskell',
        'Java',
        'JavaScript',
        'Lisp',
        'Perl',
        'PHP',
        'Python',
        'Ruby',
        'Scala',
        'Scheme'
    ];
    const $autocomplete = $('.js-autocomplete-input');

    $autocomplete.autocomplete({
        source: availableTags,
        open: function (event) {
            $(event.target).addClass('ui-autocomplete-input-opened');
        },
        close: function (event) {
            $(event.target).removeClass('ui-autocomplete-input-opened');
        }
    });

    $(window).on('optimizedResize', function () {
        $autocomplete.autocomplete('close');
    });
}
