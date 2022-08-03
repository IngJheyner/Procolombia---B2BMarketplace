/**
 * @file
 * Suscriptor file.
 */

(function ($, Drupal) {'use strict';
  Drupal.behaviors.company = {
    attach: function (context) {
    	// Detail company
    	if ($("body").hasClass('node--type-company')) {
    		var $list_img = $('.content .group-footer .slick--view--products-list-in-detail-company ul li');
    		$list_img.each(function(ind, li){
		      $(this).attr('pos', ind);
		    });

    		var $list_prod = $('.content .group-footer .view-products-list-in-detail-company .view-content .views-row');
    		$list_prod.each(function(ind, li){
		      $(this).attr('pos', ind);
		    });

    		var $link = $list_img.find('a');
    		$link.click(function(e){
    			e.preventDefault();
    			var pos_img = $(this).parents('li').attr('pos');
    			$list_prod.each(function(ind, li){
    				$(this).removeClass('active');
			      if ($(this).attr('pos') == pos_img) {
			      	$(this).addClass('active');
			      }
			    });
    		})
    	}
    }
  }
}(jQuery, Drupal));
