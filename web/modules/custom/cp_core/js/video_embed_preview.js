/**
 * @file
 * Global utilities.
 *
 */
 (function($, Drupal) {

  'use strict';

  Drupal.behaviors.cp_core_video_embed_preview = {
    attach: function(context, settings) {
      if ($('.remove-remote-video-value').length) {
        $('.remove-remote-video-value').once().click(function(e) {
          e.preventDefault();
          $(this).closest('.field--type-video-embed-field').find('input.text-full').val('');
          $(this).closest('.field--type-video-embed-field').find('.video-embed-with-preview').html('');

        })
      }
    }
  };
})(jQuery, Drupal);
