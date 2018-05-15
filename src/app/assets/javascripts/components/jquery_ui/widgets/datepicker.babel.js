if (enable.jQueryUI.datepicker === true) {
    // Localization
    $.datepicker.regional.ru = {
        closeText: "Закрыть",
        prevText: "&#x3C;Пред",
        nextText: "След&#x3E;",
        currentText: "Сегодня",
        monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
        dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
        dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
        dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        weekHeader: "Нед",
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ""
    };

    $.datepicker.setDefaults($.datepicker.regional.ru);

    // Datepicker
    const $datepicker = $('.js-datepicker-input');

    function datepickerSetMinWidth(input, dpDiv) {
        setTimeout(function () {
            $(dpDiv)
                .css('min-width', '')
                .css('min-width', $(input).outerWidth());
        }, 0);
    }

    // Force Datepicker open always under input
    $.extend(
        $.datepicker,
        {
            _checkOffset: function (inst, offset) {
                return offset;
            }
        }
    );

    $datepicker.datepicker({
        prevText: '',
        nextText: '',
        beforeShow: function (input, inst) {
            $(input).addClass('hasDatepickerFocus');

            datepickerSetMinWidth(input, inst.dpDiv);
        },
        onChangeMonthYear: function (year, month, inst) {
            datepickerSetMinWidth(inst.input, inst.dpDiv);
        },
        onClose: function (dateText, inst) {
            $(inst.input).removeClass('hasDatepickerFocus');
        },
        onSelect: function (dateText, inst) {
            $(inst.input).removeClass('hasDatepickerFocus');
        }
    });

    $(window).on('optimizedResize', function () {
        $datepicker.datepicker('hide');
    });
}
