/**
 * @file
 * Suscriptor file.
 */

(function ($, Drupal) {'use strict';

  /**
   * [getKeyByValue description]
   * @param  {[type]} object [description]
   * @param  {[type]} value  [description]
   * @return {[type]}        [description]
   */
  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }


  Drupal.behaviors.company = {
    attach: function (context) {

      $('.search-list-sector').ddslick({
        onSelected: function(data) {
          var tid_parent = data.selectedData.value,
            lang = $('.dropdown-language-item .active-language').attr('hreflang'),
            title = $('#filters-search-form #title-product'),
            tariff = $('#filters-search-form #tariff-heading'),
            sub_sector_data = [];

          $('#filters-search-form .search-list-prod-sector').remove();
          $('#filters-search-form').prepend('<input type="hidden" class="search-list-prod-sector" value="' + tid_parent + '">');

          if (tid_parent === '0') {
            title.removeAttr('disabled');
            tariff.removeAttr('disabled');
          }
          else {
            title.attr('disabled', 'disabled');
            tariff.attr('disabled', 'disabled');
          }

          var $url_json = window.location.protocol + '//' + window.location.hostname + '/' + lang + '/get-childrens-catg/' + tid_parent;
          $.getJSON($url_json, function(data) {

            if (data !== null && data !== 'undefined' && data.options !== undefined) {
              // Old code
              var sub_sector = $('#filters-search-form').find('#edit-sub-sector'),
                opt_dfl = Drupal.t('- Subcategory -'),
                keys_opts = data.options.length;
              // console.log(keys_opts);
              // if (keys_opts === 1) {
              //   sub_sector_data.push({ text: opt_dfl, value: '0' });
              //   sub_sector.ddslick('disable');
              // }
              // else if (keys_opts > 1) {
                sub_sector.ddslick('enable');
                sub_sector_data.push({ text: opt_dfl, value: '0' });

                $.each(data.options, function(index, opt) {
                  sub_sector.append('<option value="'+ opt.tid +'">' + opt.value + '</option>');
                  sub_sector_data.push({ text: opt.value, value: opt.tid });
                });

                if (typeof data['uris'] !== 'undefined') {
                  // Add uris sub sector
                  $('#uris-sub-sector').empty();
                  $.each(data.uris, function(index, uri) {
                    $('#uris-sub-sector').append('<span tid="'+ uri.tid +'">' + uri.value + '</span>');
                  });
                }
              // }

              // Sort items
              /*var sub_sector = $('#filters-search-form').find('#edit-sub-sector'),
                opt_dfl = Drupal.t('- Select option -'),
                keys_opts = Object.values(data['options']);

              if (keys_opts[0] == 0) {
                sub_sector_data.push({ text: opt_dfl, value: '0' });
                sub_sector.ddslick('disable');
              }
              else if (keys_opts[0] != 0) {
                sub_sector.ddslick('enable');
                sub_sector_data.push({ text: opt_dfl, value: '0' });
                Object.values(data['options']).forEach(function(key) {
                  sub_sector.append('<option value="'+ key +'">' + getKeyByValue(data['options'],key) + '</option>');
                  sub_sector_data.push({ text: getKeyByValue(data['options'],key), value: key });
                });

                if (typeof data['uris'] !== 'undefined') {
                  // Add uris sub sector
                  $('#uris-sub-sector').empty();
                  Object.values(data['uris']).forEach(function(key) {
                    $('#uris-sub-sector').append('<span tid="'+ key +'">' + getKeyByValue(data['uris'],key) + '</span>');
                  });
                }
              }*/

              // Subsector options
              $('#edit-sub-sector').ddslick('destroy');
              $('#edit-sub-sector').empty();
              $('#edit-sub-sector').ddslick({
                data: sub_sector_data,
                onSelected: function (data) {
                  var tid = data.selectedData.value;
                  $('#filters-search-form .edit-sub-sector').remove();
                  $('#filters-search-form').prepend('<input type="hidden" class="edit-sub-sector" value="' + tid + '">');
                }
              });

              // Default select subcat
              if ($('.content-form').data('subsector') !== undefined) {
                $('#uris-sub-sector span').each(function(index, el) {
                  if ($(this).text() === $('.content-form').data('subsector')) {
                    index++;
                    $('#edit-sub-sector').ddslick('select', {index: index });
                  }
                });
              }
            }
            else {
              $('#edit-sub-sector').ddslick();
              $('#edit-sub-sector').ddslick('disable');
            }
          });
        }
      });

      $('#edit-sub-sector').ddslick();
      $('#edit-sub-sector').ddslick('disable');


      // Default select cat
      if ($('.content-form').data('sector') !== undefined) {
        $('#uris-sector span').each(function(index, el) {
          if ($(this).text() === $('.content-form').data('sector')) {
            index++;
            $('#search-list-sector').ddslick('select', {index: index });
          }
        });
      }

    }
  }
}(jQuery, Drupal));
