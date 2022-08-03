/**
 * @file
 * Suscriptor file.
 */


(function ($, Drupal) {'use strict';

  /**
   * select_subsector_product
   * Implementation of select dependent for product subsector
   */
  function select_subsector_product() {
  	if ($('.form-prod-hs').length > 0) {
      var $form = $('.form-prod-hs'),
          $sl_sector = $form.find('.sl-sector');

      // Hierarchy select
      $sl_sector.change(function() {
        let $sl_subsector = $(this).parents('.ctn-hs').find('.sl-sub-sector'),
          sector_tid = $(this).val(),
          lang_id = drupalSettings.path.currentLanguage,
            url_json = '/' + lang_id + '/categories/subsector-select/' + sector_tid;
        $.getJSON(url_json, function(data) {
          $sl_subsector.find('option').remove();
          $sl_subsector.append(new Option(data[0], 0));
          $.each(data.options, function(i, val) {
            $sl_subsector.append(new Option(val, i));
          });
        });

      })

    }
  }


  /**
   * clear_drupal_autocomplete_id
   * @return {[type]} [description]
   */
  function clear_drupal_autocomplete_id() {
    $("body").find('.hide-autocomplete-id').on('autocompleteclose', function() {
      var val = $(this).val(),
          name = $(this).attr('name'),
          match = val.match(/\((.*?)\)$/);
      if (match) {
        $(this).parents('form').find('.' + name).val(val);
        $(this).val(val.replace(' ' + match[0], ''));
      }
    });
    $("body").find('.hide-autocomplete-id').on('autocompletechange', function() {
      var val = $(this).val(),
          name = $(this).attr('name');
      if (val == '') {
        $(this).parents('form').find('.' + name).val(val);
      }
    });
  }


  // **********************
  // *** Call functions ***
  // **********************
  select_subsector_product();
  clear_drupal_autocomplete_id();


}(jQuery, Drupal));
