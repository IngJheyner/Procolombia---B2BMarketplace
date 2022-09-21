/**
 * @file
 * Global utilities.
 *
 */
 (function($, Drupal) {
  'use strict';

  var formatDate = function (date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, "0")
      + '-' + String(date.getDate()).padStart(2, "0");
  };

  var init = function (element, startInput, endInput) {
    var startDate = null;
    var endDate = null;

    // if (typeof drupalSettings.date_range_picker !== 'undefined') {
    //   if (typeof drupalSettings.date_range_picker[element.id].start !== 'undefined') {
    //     startDate = new Date(drupalSettings.date_range_picker[element.id].start + ' 12:00');
    //   }

    //   if (typeof drupalSettings.date_range_picker[element.id].end !== 'undefined') {
    //     endDate = new Date(drupalSettings.date_range_picker[element.id].end + ' 12:00');
    //   }
    // }

    var picker = new Litepicker({
      element: element,
      //elementEnd: null,
      firstDay: 1,
      format: "DD/MM/YYYY",
      numberOfMonths: 2,
      numberOfColumns: 2,
      startDate: startDate,
      endDate: endDate,
      zIndex: 9999,
      minDate: null,
      maxDate: null,
      minDays: null,
      maxDays: null,
      selectForward: !1,
      selectBackward: !1,
      splitView: !1,
      //inlineMode: !1,
      singleMode: !1,
      //autoApply: !0,
      //allowRepick: true,
      showWeekNumbers: !1,
      showTooltip: !0,
      hotelMode: !1,
      disableWeekends: !0,
      //scrollToDate: !0,
      //mobileFriendly: !0,
      lockDaysFormat: "YYYY-MM-DD",
      lockDays: [],
      bookedDaysFormat: "YYYY-MM-DD",
      bookedDays: [],
      dropdowns: {
        minYear: 1990,
        maxYear: null,
        months: !1,
        years: !1
      },
      buttonText: {
        apply: Drupal.t("Apply"),
        cancel: Drupal.t("Cancel"),
        previousMonth: '<svg width="11" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M7.919 0l2.748 2.667L5.333 8l5.334 5.333L7.919 16 0 8z" fill-rule="nonzero"/></svg>',
        nextMonth: '<svg width="11" height="16" xmlns="http://www.w3.org/2000/svg"><path d="M2.748 16L0 13.333 5.333 8 0 2.667 2.748 0l7.919 8z" fill-rule="nonzero"/></svg>'
      }, tooltipText: {one: "day", other: "days"}, onShow: function () {
        console.log("onShow callback")
      },
      setup: (picker) => {
        picker.on('selected', (start, end) => {
          startInput.val(formatDate(start));
          endInput.val(formatDate(end));
        });
      }
    });

  };

  Drupal.behaviors.cp_core_litepicker = {
    attach: function (context) {
      var $dateRangeWidgets = $(context).find('.litepicker-date');
      $dateRangeWidgets.each(function () {
        var $dateRangeWidget = $(this);

        var start = $(this).closest('form').find('.litepicker-start');
        var end = $(this).closest('form').find('.litepicker-end');
        var startInput = start.first();
        start.closest('.form-type-textfield').hide();
        var endInput = end.first();
        end.closest('.form-type-textfield').hide();

        $dateRangeWidget.once('daterange-widget').each(function () {
          init(this, startInput, endInput);
        });
      });

    }
  }

})(jQuery, Drupal);
