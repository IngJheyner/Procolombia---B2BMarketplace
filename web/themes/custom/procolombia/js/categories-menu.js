/**
 * @file
 * Suscriptor file.
 */

(function ($, Drupal) {'use strict';
  Drupal.behaviors.categories_menu = {
    attach: function (context) {
      // if menu exists
      if ($('.menu-categories-block').length > 0) {
        // if parent list exists
        if ($('.menu-categories-block .overlay .parent').length > 0){
          $('.menu-categories-block .overlay .parent').each(function () {
            // On click category collapse animation
            $(this).on("click", function (e) {
              e.stopImmediatePropagation();
              // title menu hidden
              $(".menu-categories-block .menu-title-categories").toggleClass('d-none');
              // all parents hidden
              $('.menu-categories-block .overlay .parent').toggleClass('d-none').toggleClass('l2r');
              // this parent is visible
              $(this).toggleClass('d-none');
              // this childs are visibles
              $(".view-menu-categories-childs", this).toggleClass('d-block');
              // this Link is hidden
              $(".category-link", this).toggleClass('d-none');
              // this arrow is hidden
              $(".category-collapse", this).toggleClass('d-none');
              // add parent class selected
              $(this).toggleClass('selected');
              // toggle classes for animation left to right
              $(".view-menu-categories-childs", this).toggleClass('r2l');
            });
          });
        }
        // when clic on close btn
        if ($('.btn-menu-categories .btn-close').length > 0) {
          $('.btn-menu-categories .btn-close').each(function () {
            $(this).on("click", function (e) {
              e.stopImmediatePropagation();
              e.preventDefault();
              $('.btn-menu-categories .btn-close').toggleClass('d-none');
              $('.menu-categories-block .view-header #block-procolombialogo').toggleClass('d-block');
              $('.menu-categories-block .overlay').toggleClass('visible').toggleClass('invisible');
              // toggle classes for animation left to right
              $('.menu-categories-block .overlay .categories').toggleClass('l2r').toggleClass('r2l');
              $('.btn-menu-categories .btn-close').toggleClass('l2r').toggleClass('r2l');
              $('.menu-categories-block .view-header #block-procolombialogo').toggleClass('l2r').toggleClass('r2l');
              // disable scroll on page when menu is active
              $('body').toggleClass('hidden-overflow');
            });
          });
        }
        // when clic on menu btn
        if ($('.btn-menu-categories .btn-open').length > 0) {
          $('.btn-menu-categories .btn-open').each(function () {
            $(this).on("click", function (e) {
              e.stopImmediatePropagation();
              e.preventDefault();
              $('.btn-menu-categories .btn-close').toggleClass('d-none');
              $('.menu-categories-block .view-header #block-procolombialogo').toggleClass('d-block');
              $('.menu-categories-block .overlay').toggleClass('visible').toggleClass('invisible');
              // toggle classes for animation left to right
              $('.menu-categories-block .overlay .categories').toggleClass('l2r').toggleClass('r2l');
              $('.btn-menu-categories .btn-close').toggleClass('l2r').toggleClass('r2l');
              $('.menu-categories-block .view-header #block-procolombialogo').toggleClass('l2r').toggleClass('r2l');
              // disable scroll on page when menu is active
              $('body').toggleClass('hidden-overflow');
            });
          });
        }
        // when clic on a target
        if ($('.menu-categories-block .overlay a').length > 0) {
          $('.menu-categories-block .overlay a').each(function () {
            $(this).on("click", function (e) {
              e.stopImmediatePropagation();
              $('.btn-menu-categories .btn-close').toggleClass('d-none');
              $('.menu-categories-block .view-header #block-procolombialogo').toggleClass('d-block');
              $('.menu-categories-block .overlay').toggleClass('visible').toggleClass('invisible');
              // toggle classes for animation left to right
              $('.menu-categories-block .overlay .categories').toggleClass('l2r').toggleClass('r2l');
              // $('.menu-categories-block .overlay').fadeToggle(3000);
              // Hidden overflow on body when menu is open
              $('body').toggleClass('hidden-overflow');
            });
          });
        }
        // disble click over category name
        if ($('.menu-categories-block .child-category-title').length > 0) {
          $('.menu-categories-block .child-category-title').each(function () {
            $(this).on("click", function (e) {
              e.stopImmediatePropagation();
              e.preventDefault();
            });
          });
        }
      }
    }
  }
}(jQuery, Drupal));
