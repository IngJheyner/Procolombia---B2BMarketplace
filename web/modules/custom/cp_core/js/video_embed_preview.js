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
            $(this).closest('div[data-drupal-selector^=edit-field-pr-video]').closest('div[data-drupal-selector^=edit-field-pr-video]').find('button').show();
          } else {
            $(this).closest('div[data-drupal-selector^=edit-field-pr-video]').closest('div[data-drupal-selector^=edit-field-pr-video]').find('button').hide();
          }
        });
        $('.remove-remote-video-value').once().click(function(e) {
          e.preventDefault();
          $(this).closest('div[data-drupal-selector^=edit-field-pr-video]').find('input.text-full').val('');
          $(this).closest('div[data-drupal-selector^=edit-field-pr-video]').find('.video-embed-with-preview').addClass('video-embed-preview-empty');
          $(this).closest('div[data-drupal-selector^=edit-field-pr-video]').find('button').show();
          $(this).closest('div[data-drupal-selector^=edit-field-pr-video]').find('.video-embed-with-preview').html('');
        })
      }
    }
  };
})(jQuery, Drupal);
