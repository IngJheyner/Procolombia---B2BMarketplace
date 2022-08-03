/**
 * @file
 * Validation messages file.
 */

(function ($, Drupal) {'use strict';
  Drupal.behaviors.select_company_category = {
    attach: function (context) {
      var select_categories = $(".list-sector-company .dd-selected-value");
      $(".list-sector-company .dd-options").unbind().click(function () {
        var selected_value = $(".list-sector-company .dd-selected-value").val();
        if(selected_value == 0){
          selected_value = 'All';
        }
        $("[name='field_categorization']").val(selected_value);
      });
    }
  }
}(jQuery, Drupal));
