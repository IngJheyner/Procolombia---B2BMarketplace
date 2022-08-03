/**
 * @file
 * Filters search file.
 */

(function ($) {
  $(document).ready(function(){

  	if ($("#filters-search-form").length > 0) {

			var $sector = $('#filters-search-form #search-list-sector');
			var $sector_list = $('#filters-search-form .search-list-sector');
			var $sub_sector = $('#edit-sub-sector');
			var $title = $('#filters-search-form #title-product');
			var $tariff = $('#filters-search-form #tariff-heading');

			// Title Texfield keyup
      if ($title.val() !== '') {
        $sector.ddslick('disable');
        $sector_list.addClass('disabled');
        $('#edit-sub-sector').ddslick('disable');
        $tariff.attr('disabled', true);
      }
			$('#filters-search-form #title-product').on('keyup', function(e) {
				var val_field = $(this).val();
				if (val_field != '') {
					$sector.ddslick('disable');
					$sector_list.addClass('disabled');
					$('#edit-sub-sector').ddslick('disable');
					$tariff.attr('disabled', true);
				}
				else {
					$sector.ddslick('enable');
					$sector_list.removeClass('disabled');
					$tariff.attr('disabled', false);
        }

        if (e.keyCode === 13) {
          $('#filters-search-form .btn-search').click();
        }
	    });

	    // Tafiff Texfield keyup
			$('#filters-search-form #tariff-heading').on('keyup', function(e) {
				var val_field = $(this).val();
				if (val_field != '') {
					$sector.ddslick('disable');
					$sector_list.addClass('disabled');
					$('#edit-sub-sector').ddslick('disable');
					$title.attr('disabled', true);
				}
				else {
					$sector.ddslick('enable');
					$sector_list.removeClass('disabled');
					$title.attr('disabled', false);
        }

        if (e.keyCode === 13) {
          $('#filters-search-form .btn-search').click();
        }
	    });

			// Submit filters form
			$('#filters-search-form .btn-search').click(function(e){
				e.preventDefault();
				//var tid_sector = $sector.val();
        var tid_sector = $('#search-list-sector').find('.dd-selected-value').val();
        var tid_sub_sector = $('#edit-sub-sector').find('.dd-selected-value').val();
				var title_val = $title.val();
				var tariff_val = $tariff.val();
				var url = $('#filters-search-form .content-form').attr('data-url1');
				var url_direct = '';

				// Search sector and subsector
				var name_sector = '';
				var name_sub_sector = '';
				if (tid_sector != 0) {
					$('#uris-sector span').each(function(){
			       if ($(this).attr('tid') == tid_sector) {
			       	name_sector = $(this).text();
			       	return false;
			       }
			    });

					if (tid_sub_sector != 0) {
				    $('#uris-sub-sector span').each(function(){
				       if ($(this).attr('tid') == tid_sub_sector) {
				       	name_sub_sector = $(this).text();
				       	return false;
				       }
				    });
					}

			    if (url !== null && url !== 'undefined') {
			    	if (name_sector !== null && name_sector !== 'undefined' || name_sub_sector !== null && name_sub_sector !== 'undefined') {
				    	if (name_sector !== null && name_sector !== 'undefined') {
				    		url_direct = url + '/' + name_sector;
				    	}
				    	if (name_sub_sector !== null && name_sub_sector !== 'undefined') {
				    		url_direct = url + '/' + name_sector + '/' + name_sub_sector;
				    	}
				    	window.location.href = url_direct;
			    	}
			    }
				}

				// Search title
				if (title_val !== null && title_val !== 'undefined' && title_val != '') {
					if (url !== null && url !== 'undefined') {
						url_direct = url += '?title='+ title_val;
						window.location.href = url_direct;
					}
				}

				// Search tariff
				if (tariff_val !== null && tariff_val !== 'undefined' && tariff_val != '') {
					if (url !== null && url !== 'undefined') {
						url_direct = url += '?tariff='+ tariff_val;
						window.location.href = url_direct;
					}
				}
			});
		
			 // label active search productos home
            /*var input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], input[type=date], input[type=time], textarea';
			$(input_selector).each( function(index, el) {
				var $this = $(this);
					if (el.value.length > 0 || $(el).is(':focus') || el.autofocus || $this.attr('placeholder') !== null) {
						$this.siblings('label').addClass('active');
					} else if (element.validity) {
						$this.siblings('label').toggleClass('active', el.validity.badInput === true);
					} else {
						$this.siblings('label').removeClass('active');
					}
			});*/
			
		}
		
	});
})(jQuery);





