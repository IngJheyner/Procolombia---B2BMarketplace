/**
 * @file
 * Global utilities.
 *
 */
 (function($, Drupal) {

  'use strict';

  Drupal.behaviors.sf_structure_formatter = {
    attach: function(context, settings) {

      if ($('.sf-structure-formatter-show-less').length) {
        $('.sf-structure-formatter-show-less').once().click(function (e) {
          e.preventDefault();
          $(this).closest('details').find('summary').click();
        });
      }

    }
  };
})(jQuery, Drupal);
