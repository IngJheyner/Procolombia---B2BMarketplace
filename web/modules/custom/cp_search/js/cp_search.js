/**
 * @file
 * Suscriptor file.
 */

(function($, Drupal) {
    'use strict';

    // Filters select search
    $(".filters-select").change(function() {
      var selectInput = $('option:selected', this).attr('cdata-url');
      var radioInputCheck = $('input:checked', this).attr('cdata-url');
      var radioInputUncheck = $('input:unchecked', this).attr('cdata-parametro');

      var base_url = window.location.origin;
      var urlHref = window.location.href;
      if (selectInput) {
        window.location.href = base_url + selectInput;
      }

      if (radioInputCheck) {
        if (!window.location.href.includes(radioInputCheck)) {
          window.location.href = base_url + radioInputCheck;
        }
      }

      if (radioInputUncheck) {
       window.location.href = urlHref.replace('&'+radioInputUncheck,'').replace(radioInputUncheck,'').replace('?&','?'); 
      }

    });

    Drupal.behaviors.cp_search = {
      attach: function(context) {

        // ********************************
        // Mobile view mode filters search 
        // ********************************
        
        $('.filters-search-form .show-filter', context).once('showFilterBehavior').click(function() {
          if ($('.filters-search-form .content-form').hasClass('is-fixed')) {
            $('.filters-search-form .content-form').removeClass('is-fixed');
            $('.filters-search-form .is-mobile .show-filter').removeClass('view');
            $('.filters-search-form .content-form').addClass('is-desktop');
          } else {
            $('.filters-search-form .content-form').removeClass('is-desktop');
            $('.filters-search-form .content-form').addClass('is-fixed');
            $('.filters-search-form .is-mobile .show-filter').addClass('view');
          }
        });

        $('.filters-search-form .view-mode', context).once('viewModeBehavior').click(function() {
          if ($('.view-id-search_products .view-content').hasClass('view-mode-2-col')) {
            $(this).removeClass('cols-2');
            $(this).addClass('cols-1');
            $('.view-id-search_products .view-content').removeClass('view-mode-2-col');
            $('.view-id-search_products .view-content .views-row').addClass('col-md-4');
            $('.view-id-search_products .view-content .views-row').removeClass('col-xs-2');
          } else {
            $(this).removeClass('cols-1');
            $(this).addClass('cols-2');
            $('.view-id-search_products .view-content').addClass('view-mode-2-col');
            $('.view-id-search_products .view-content .views-row').removeClass('col-md-4');
            $('.view-id-search_products .view-content .views-row').addClass('col-xs-2');
          }
        });


        // ************************
        // Switch language search
        // ************************
        
        // Default value
        $('.block-switch-language-search select.dropdown-language-item').find('option').each(function(index, el) {
          if (!$(this).hasClass('secondary-action')) {
            $(this).attr('selected');
            $('.dropdown-language-item').val($(this).val());
          }
        });

        // Reload page
        $('.block-switch-language-search select.dropdown-language-item').on('change', function() {
          var select = $(this).find('option:selected');
          window.location.replace(select.data('href'));
        });

      }
    }
}(jQuery, Drupal));