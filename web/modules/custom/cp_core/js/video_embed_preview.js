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
        $('.video-embed-with-preview').each(function() {
          if ($(this).hasClass('video-embed-preview-empty')) {
            $(this).closest('.field--type-video-embed-field').find('button').show();
          } else {
            $(this).closest('.field--type-video-embed-field').find('button').hide();
          }
        });
        $('.remove-remote-video-value').once().click(function(e) {
          e.preventDefault();
          $(this).closest('.field--type-video-embed-field').find('input.text-full').val('');
          $(this).closest('.field--type-video-embed-field').find('.video-embed-with-preview').addClass('video-embed-preview-empty');
          $(this).closest('.field--type-video-embed-field').find('button').show();
          $(this).closest('.field--type-video-embed-field').find('.video-embed-with-preview').html('');
        })
      }
    }
  };
})(jQuery, Drupal);
